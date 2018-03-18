var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var notifications = require('./notifications');

var UserSchemaTest = mongoose.Schema({
	username: {type: String, index: true},
	name: {
		first: {type: String},
		last: {type: String},
		full: {type: String}
	},
	secure: {
		password: {type: String},
	},
	personal: {
		email: {type: String},
		birth: {
			day: {type: String},
			month: {type: String},
			year: {type: String},
			fullDate: {type: Date},
		}
	},
	stats: {
		following: [{
			username: {type: String},
		}],
		followers: [{
			username: {type: String},
		}],
	},
	logs: {
		joined: {type: Date, default: Date.now},
		last_login: {type: Date},
		online: {type: Boolean, default: false},
	},
	profile: {
		profilePic: {type: String},
		coverPhoto: {type: String},
	}
});

var UserTest = module.exports = mongoose.model('UserTest', UserSchemaTest);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.secure.password, salt, function(err, hash){
			newUser.secure.password = hash;
			newUser.save(callback);
		})
	});
	var defaultNotification = new notifications({
		username: newUser.username
	});
	notifications.newNotification(defaultNotification, function(err, res){
		if (err) throw err
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	UserTest.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback){
	var query = {"personal.email": email};
	UserTest.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	UserTest.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if (err) throw err;
		callback(null, isMatch);
	});
}

module.exports.updateStatus = function(username, online, callback){
	UserTest.update(
		{username: username},
		{$set: {'logs.online': online}},
		function(err, res){
			if (err) throw err;
		}
	);
}

module.exports.updateLastLogin = function(username, lastLogin, callback){
	UserTest.update(
		{username: username},
		{$set: {'logs.last_login': lastLogin}},
		callback
	);
}

module.exports.updateProfilePic = function(username, picUrl, callback){
	UserTest.update(
		{username: username},
		{$set: {'profile.profilePic' : picUrl}},
		function(err, res){
			if (err) throw err;
		}
	);
}

module.exports.updateCoverPhoto = function(username, picUrl, callback){
	UserTest.update(
		{username: username},
		{$set: {'profile.coverPhoto' : picUrl}},
		function(err, res){
			if (err) throw err;
		}
	);
}

module.exports.newFollowing = function(me, who, callback){

	UserTest.getUserByUsername(me, function(err, doc){
		var following;
		for (var i = 0; i < doc.stats.following.length; i++){
			if (doc.stats.following[i].username == who){
				// already following
				following = true;
			} else {
				// not following
				following = false;
			}
		}
		if (!following){
			UserTest.update(
				{username: me},
				{$addToSet: {'stats.following' : {username: who}}},
				callback
			);
		} else {
			console.log('already following!');
		}
	});
}

module.exports.newFollower = function(me, who, callback){
	
	UserTest.getUserByUsername(who, function(err, doc){
		var follower;
		for (var i = 0; i < doc.stats.followers.length; i++){
			if (doc.stats.followers[i].username == me){
				// already following
				follower = true;
			} else {
				// not following
				follower = false;
			}
		}
		if (!follower){
			UserTest.update(
				{username: who},
				{$addToSet: {'stats.followers' : {username: me}}},
				callback
			);
		} else {
			console.log('already follower!');
		}
	});

}