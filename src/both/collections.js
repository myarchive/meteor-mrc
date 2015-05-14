/* Establish Collections
 ***********************/

Meteor.mrc = new Meteor.Collection("mrc");
Meteor.rooms = new Meteor.Collection("rooms");
Meteor.messages = new Meteor.Collection("messages");



/* Allow & Deny Permissions
 **************************/

// Submit new message
Meteor.messages.allow({
	insert: function (userId, doc) {
		// the user must be logged in, and the sender must be self
		// add room attendance rules here also...
		// join, part, quit, etc. can not be sent by user rules here...
		// validate message format, etc. also...
		return (userId && doc.user === userId);
	}
});



/* Before & After Hooks
 **********************/

Meteor.messages.before.insert(function (userId, doc) {
	doc.date = new Date();
});

Meteor.users.after.update(function (userId, doc, fieldNames, modifier, options) {
	var owners = [];
	var admins = [];
	var adminw = [];
	var staffs = [];
	var ausers = [];
	var guests = [];

	var users = Meteor.users.find({});
	users.forEach(function (user) {
		if (!Roles.userIsInRole(user._id, ['owner','admin','staff','user'], 'server'))
			guests.push(user._id);
		else {
			if (Roles.userIsInRole(user._id, 'owner', 'server'))
				owners.push(user._id);
			if (Roles.userIsInRole(user._id, ['owner','admin'], 'server'))
				admins.push(user._id);
			if (Roles.userIsInRole(user._id, 'admin', 'server'))
				adminw.push(user._id);
			if (Roles.userIsInRole(user._id, 'staff', 'server'))
				staffs.push(user._id);
			if (Roles.userIsInRole(user._id, 'user', 'server'))
				ausers.push(user._id);
		}
	});
	Meteor.rooms.update({droom: true}, {$set: {mods: admins, vips: staffs}});
	Meteor.rooms.update({sroom: true}, {$set: {mods: admins, vips: staffs}});
	Meteor.rooms.update({aroom: true}, {$set: {mods: owners, vips: adminw}});
}, {fetchPrevious: false});



/* Subscribes
 ************/

if (Meteor.isClient) {
	Meteor.subscribe("rooms", { onReady: function() { 
		Meteor.subscribe("roomMessages", Meteor.rooms.findOne({droom: true})._id);
	}});
	Meteor.subscribe('usernames');
	Meteor.subscribe('userStatus');
	Meteor.subscribe('adminInfo');
}
