var mongoose = require('mongoose');

var notificationsSchema = mongoose.Schema({
	username: {type: String, index: true},
	notifications: [{
		from: {
			name: String,
			username: String,
			profilePic: String,
		},
		when: Date,
		text: String,
		read: {type: Boolean, default: false},
	}]
});

var notifications = module.exports = mongoose.model('notifications', notificationsSchema);

module.exports.newNotification = function(newNotification, callback){
	newNotification.save(callback);
}

module.exports.addNotification = function(notification, callback){
	notifications.update(
		{username: notification.username},
		{$addToSet: {notifications: {
			from: {
				name: notification.from.name,
				username: notification.from.username,
				profilePic: notification.from.profilePic
			},
			when: notification.when,
			text: notification.text
		}}},
		callback
	);
}

module.exports.allNotificationsRead = function(who, callback){
	notifications.getNotificationsByUsername(who, function(err, res){
		if (err) throw err;
		res.notifications.forEach(function(doc){
			doc.read = true;
		});
		res.save(callback);
	});
}

module.exports.getNotificationsByUsername = function(username, callback){
	var query = {username: username};
	notifications.findOne(query, callback);
}