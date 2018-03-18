var express = require('express');
var router = express.Router();

var UserTest = require('../models/UserTest');
var notifications = require('../models/notifications');
var appjs = require('../app');
var kokot = require('../views/kokot')


router.get('/', ensureAuthenticated, function(req, res){
	appjs.renderNotifications(req, res, function(err){
		if (err) throw err;
		res.render('index', {
			notifications: appjs.renderNotifications.notificationsRender,
			kokot: kokot,
			messages: null
		});
	});
});

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	} else {
		// req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;