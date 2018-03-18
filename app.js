//  App Requirements
//  ----------------------------------------
var express =             require('express');
var app =                 express();
var path =                require('path');
var cookieParser =        require('cookie-parser');
var bodyParser =          require('body-parser');
var exphbs =              require('express-handlebars');
var expressValidator =    require('express-validator');
var flash =               require('connect-flash');
var session =             require('express-session');
var Grid =                require('gridfs-stream');
var fs =                  require('fs');
var GridFsStorage =       require('multer-gridfs-storage');
var multer =              require('multer');
var passportSocketIo =    require('passport.socketio');
var server =              require('http').createServer(app);
var RedisStore =          require('connect-redis')(session);

//  Mongoose Models
//  ----------------------------------------
var UserTest =            require('./models/UserTest');
var notifications =       require('./models/notifications');

//  Routes
//  ----------------------------------------
var routes =              require('./routes/index');
var users =               require('./routes/users');
var userq =               require('./routes/user');

//  MongoDB & Mongoose
//  ----------------------------------------
var mongo =               require('mongodb');
var mongoose =            require('mongoose');
var ObjectId =            require('mongodb').ObjectID;
mongoose.connect('mongodb://localhost/laces');
var db = mongoose.connection;

//  Passport.js
//  ----------------------------------------
var passport =            require('passport');
var LocalStrategy =       require('passport-local').Strategy;

//  Socket.io
//  ----------------------------------------
var io =                  require('socket.io').listen(server);
var event =               require('socket.io-events')();


//  Session Settings
//  ----------------------------------------
var sessionStore = new RedisStore({
    host: '127.0.0.1',
    port: 6379,
});
var expressSession = session({
  store: sessionStore,
  key: 'express.sid',
  secret: 'laces',
  resave: true,
  saveUninitialized: true
});

//  Connect GridFS with MongoDB
//  ----------------------------------------
Grid.mongo = mongoose.mongo;
var gfs;
db.once('open', function(){
  console.log('- Connection open-');
  gfs = Grid(db.db);
});


//  App Configuration
//  ----------------------------------------
app.use(function(req, res, next){
  req.io = io;
  next();
});
app.set('port', (process.env.PORT || 3000));
server.listen(process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
  helpers: require('./helpers/handlebars.js').helpers
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  },
  customValidators: {
    userExists(value){
      return new Promise((resolve, reject) => {
        UserTest.getUserByUsername(value, function(err, res){
          if (res) {
            return reject();
          } else {
            return resolve();
          }
        });
      });
    },
    emailInUse(value){
      return new Promise((resolve, reject) => {
        UserTest.getUserByEmail(value, function(err, res){
          if (res) {
            return reject();
          } else {
            return resolve();
          }
        });
      });
    }
  }
}));

app.use(flash());
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/user', userq);

app.set('socketio', io);

//  Authorize Socket.io with Passport Session
//  ---------------------------------------- 
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
  secret:       'laces',    // the session_secret to parse the cookie
  store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
  fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
}));

io.use(function(socket, next){
  expressSession(socket.request, socket.request.res, next);
});

function onAuthorizeSuccess(data, accept){
  accept();
};

function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);
}

io.use(event);


//  Upload Handlers
//  ----------------------------------------
app.post('/upload/profile_pic', function(req, res) {
  var storage = GridFsStorage({
    url: 'mongodb://localhost/laces',
    file: (req, file) => {
      return {
        filename: req.user.username + '-' + Date.now() + path.extname(file.originalname),
        metadata: {
          originalName: file.originalname,
          username: req.user.username,
          id: ObjectId(req.user.id),
          type: 'profilePicture'
        }
      };
    },
  });

  var upload = multer({
    storage: storage,
    limits: {
      fileSize: 10000000
    },
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('file');


  upload(req,res,function(err){
      if(err){
        res.render('index', {
          msg:err
        });
      } else {
        gfs.files.find({'metadata.username' : req.user.username, 'metadata.type': 'profilePicture'}).toArray(function(err, arr){
          var file = arr[arr.length - 1];
          UserTest.updateProfilePic(req.user.username, file.filename, function(err, res){
            if (err) throw err
          });
        });
        res.redirect('/');
      }
  });
});

app.post('/upload/cover_photo', function(req, res) {
  var storage = GridFsStorage({
    url: 'mongodb://localhost/laces',
    file: (req, file) => {
      return {
        filename: req.user.username + '-' + Date.now() + path.extname(file.originalname),
        metadata: {
          originalName: file.originalname,
          username: req.user.username,
          id: ObjectId(req.user.id),
          type: 'coverPhoto'
        }
      };
    },
  });

  var upload = multer({
    storage: storage,
    limits: {
      fileSize: 10000000
    },
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('file');

  upload(req,res,function(err){
      if(err){
        res.render('index', {
          msg:err
        });
      } else {
        gfs.files.find({'metadata.username' : req.user.username, 'metadata.type': 'coverPhoto'}).toArray(function(err, arr){
          var file = arr[arr.length - 1];
          UserTest.updateCoverPhoto(req.user.username, file.filename, function(err, res){
            if (err) throw err
          });
        });
        res.redirect('/');
      }
  });
});


function checkFileType(file, cb){
  var filetypes = /jpeg|jpg|png/;
  var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  var mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype){
    return cb(null, true);
  } else {
    cb('Error: Unsupported file type. JPEG, JPG or PNG only allowed.');
  }
}


//  Stream Files from MongoDB (multerfs)
//  ---------------------------------------- 
app.get('/file/:filename', function(req, res){
   
  gfs.files.findOne({ filename: req.params.filename}, function (err, file) {
    if (err) throw err;
    if (!file){
      // not found
      res.redirect('/');
    } else {
      // found
      var readstream = gfs.createReadStream({
       filename: file.filename
      });
      res.set('Content-Type', file.contentType)
      return readstream.pipe(res);
    }
  });
});

//  Socket.io event handlers
//  ---------------------------------------- 
var sockets = {};
io.sockets.on('connection', function(socket){

  // add newly connected socket to 'sockets' basket
  sockets[socket.request.session.passport.user] = socket.id;

  // notification handling
  socket.on('new notification', function(data){
    
    var newNotif = {
      username: data.toFollow,
      from: {
        name: data.from,
        username: data.fromU,
        profilePic: data.fromPic,
      },
      when: data.when,
      text: data.text,
      read: false,
    }

    notifications.addNotification(newNotif, function(err, res){
      if (err) throw err;

      socket.emit('receive notification', {
        from: data.from,
        fromU: data.fromU,
        fromPic: data.fromPic,
        text: data.text,
        when: data.when,
        toFollow: data.toFollow
      });
    });

  });

  // search
  socket.on('search query', function(query){
    var me = sockets[socket.request.session.passport.user];
    var search = new RegExp(query, "gi");
    UserTest.find({"name.full": {$regex: search}}, function(err, doc){
      io.to(me).emit('found result', doc);
    });
  });

  // seen notifications
  socket.on('read notifications', function(){
    // var meID = socket.request.session.passport.user;
    // var meU;
    UserTest.getUserById(socket.request.user, function(err, res){
      var meU = res.username;
      notifications.allNotificationsRead(meU, function(err, res){
        if (err) throw err;
      });
    });
  });

  // socket disconnect - remove disconnected socket from 'sockets' basket
  socket.on('disconnect', function(){
    delete sockets[socket.request.session.passport.user]
  });

});


//  Exported Functions
//  ---------------------------------------- 
module.exports.renderNotifications = function(req, res, callback){
  var me = req.user.username;
  var notificationsRender = [];
  notifications.getNotificationsByUsername(me, function(err, doc){
    if (err) throw err;
    if (doc) {
      for (var i = 0; i < doc.notifications.length; i++){
        notificationsRender.push(doc.notifications[i])
      }
    }
    module.exports.renderNotifications.notificationsRender = notificationsRender;
    callback();
  });
}


