var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ObjectId = require('mongodb').ObjectID;

// var user = require('../models/user');
var UserTest = require('../models/UserTest');
var appjs = require('../app');

router.get('/:user', function(req, res){

	appjs.renderNotifications(req, res, function(err){
		var userInfo = [];
		if (err) throw err;
		if (req.params.user == req.user.username){
			res.redirect('/');
		} else {
			UserTest.getUserByUsername(req.params.user, function(err, doc){
				if (err) throw err;
				userInfo.push(doc)

				res.render('user', {
					userInfo: userInfo,
					notifications: appjs.renderNotifications.notificationsRender,
					layout: 'userlayout'
				});
			});
		}
	});

});

router.get('/:user/followers', function(req, res){

	appjs.renderNotifications(req, res, function(err){
		var userInfo = [];
		var userFollowersInfo = [];
		if (err) throw err;
		if (req.params.user == req.user.username){
			res.redirect('/');
		} else {
			UserTest.getUserByUsername(req.params.user, function(err, doc){
				if (err) throw err;
				userInfo.push(doc)

				userInfo[0].stats.followers.forEach(function(d){
					UserTest.getUserByUsername(d.username, function(err, follower){
						if (err) throw err;
						userFollowersInfo.push(follower);

						res.render('followers', {
							userInfo: userInfo,
							notifications: appjs.renderNotifications.notificationsRender,
							followers: userFollowersInfo,
							layout: 'userlayout',
						});
					})
				})
			});
		}
	});

});

router.get('/add/:user', function(req, res, next){
	var io = req.io;

	io.emit('notification', {
		toFollow: req.params.user,
		when: new Date(),
		from: req.user.name.full,
		fromU: req.user.username,
		fromPic: req.user.profile.profilePic,
	}, next());

	UserTest.newFollowing(req.user.username, req.params.user, function(err, res){
		if (err) throw err;
	});
	UserTest.newFollower(req.user.username, req.params.user, function(err, res){
		if (err) throw err;
	});
	res.redirect('/user/'+req.params.user);

});




module.exports = router;