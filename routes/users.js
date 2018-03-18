var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ObjectId = require('mongodb').ObjectID;

// var user = require('../models/user');
var UserTest = require('../models/UserTest');
var appjs = require('../app');

router.get('/register', function(req, res){
	 res.render('login_register/register', {layout: 'loginlayout'});
});

router.get('/login', function(req, res){
	res.render('login_register/login', {layout: 'loginlayout'});
});

router.post('/register', function(req, res){
	var name = req.body.name;
	var name2 = req.body.name2;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var passowrd2 = req.body.password2;
	var dobMonth = req.body.dob_month;
	var dobDay = req.body.dob_day;
	var dobYear = req.body.dob_year;
	var date = dobMonth+"-"+dobDay+"-"+dobYear;
	var dobDate = new Date(date.toString());
	var fullName = name + " " + name2;

	// fields are not empty
	req.checkBody({
		'name': {
			notEmpty: true,
			errorMessage: 'This field is required'
		},
		'name2': {
			notEmpty: true,
			errorMessage: 'This field is required'
		},
		'username': {
			notEmpty: true,
			errorMessage: 'Username is required'
		},
		'email': {
			notEmpty: true,
			errorMessage: 'Email is required'
		},
		'password': {
			notEmpty: true,
			errorMessage: 'Password is required',
		},
		'password2': {
			notEmpty: true,
			errorMessage: 'Password confirmation is required'
		},
		'dob_year': {
			notEmpty: true,
			errorMessage: 'This field is required'
		},
		'dob_month': {
			notEmpty: true,
			errorMessage: 'This field is required'
		},
		'dob_day': {
			notEmpty: true,
			errorMessage: 'This field is required'
		}
	});

	// email is valid email
	req.checkBody({
		'email': {
			isEmail: true,
			errorMessage: 'This email is not valid'
		}
	});

	// password is specified length
	req.checkBody('password', 'Password must be atleast 6 characters long').isLength({min: 6});

	// password confirmation equals original password
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	// username or email is not already in use
	req.checkBody({
		'username': {
			userExists: username,
			errorMessage: 'This username is already taken'
		},
		'email': {
			emailInUse: email,
			errorMessage: 'This email is already assigned to an account'
		}
	});

	req.checkBody('name', 'Name must contain only characters a-Ž').matches(/[A-Ža-ž]/);
	req.checkBody('name2', 'Name must contain only characters a-Ž').matches(/[A-Ža-ž]/);
	req.checkBody('username', 'Username must contain only characters a-Z and numbers 0-9').matches(/[A-Za-z0-9]/)
	req.checkBody('password', 'Password must contain atleast one uppercase character, one lowercase character and at least one digit.').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/);

	req.asyncValidationErrors().then(function() {
        next();
    }).catch(function(errors) {
    	console.log(errors);
        if(errors.length) {
            res.render('login_register/register', {layout: 'loginlayout', errors: errors});
        } else {
        	var newUserTest = new UserTest({
				username: username,
				name: {
					first: name,
					last: name2,
					full: fullName
				},
				secure: {
					password: password
				},
				personal: {
					email: email,
					birth: {
						day: dobDay,
						month: dobMonth,
						year: dobYear,
						fullDate: dobDate,
					}
				}
			});

			UserTest.createUser(newUserTest, function(err, res){
				if (err) throw err;
			});

			req.flash('success_msg', 'Registration successful, you can now login');

			res.redirect('/users/login');
        }
    });

});

passport.use(new LocalStrategy(function(username, password, done){
	UserTest.getUserByUsername(username, function(err, user){
		if (err) throw err;
		if (!user){
			return done(null, false, {message: 'User not found'});
		}

		UserTest.comparePassword(password, user.secure.password, function(err, isMatch){
			if (err) throw err;
			if (isMatch) {
				return done(null, user);
			} else {
				return done(null, false, {message: 'Invalid password'});
			}
		})
	})
}));

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	UserTest.getUserById(id, function(err, user){
		done(err, user);
	});
});

router.post('/login', passport.authenticate('local', {successRedirect: '/users/pre', failureRedirect: '/users/login', failureFlash: true}), function(req, res){
	res.redirect('/users/pre');
});

router.get('/logout', function(req, res){
	UserTest.updateStatus(req.user.username, false, function(req, res){
		if (err) throw err;
	});
	req.logout();
	req.flash('success_msg', 'Successfully logged out.');
	res.redirect('/users/login');
});

router.get('/pre', function(req, res){
	UserTest.updateStatus(req.user.username, true, function(err, res){
		if (err) throw err;
	});
	UserTest.updateLastLogin(req.user.username, new Date(), function(err, res){
		if (err) throw err;
	});
	res.redirect('/');
})









module.exports = router;






