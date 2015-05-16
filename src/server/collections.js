/* Indexes
 *********/

Meteor.rooms._ensureIndex('name', {unique: 1});



/* Default server settings if null
 *********************************/

Meteor.startup(function () {
	if (Meteor.mrc.find({}).count() === 0) {
		mrc = Meteor.mrc.insert({
			sitename: 'MRC+', // Your site name
			privserver: false, // Prevents guests from seeing even default room.  Once signed in an admin must promote to use before use.
			guestrooms: false, // Can guests see rooms? (other than default room)
			guestchats: false, // Can guests use chat system?
			guestsuppo: false  // Can guests use support?
		});
	}

	if (Meteor.rooms.find({}).count() === 0) {
		Meteor.rooms.insert({name: "Main Room", droom: true, force: true, guests: true, invite: false, limits: false});
		Meteor.rooms.insert({name: "Staff Room", sroom: true, guests: false, invite: false, limits: {role: ['helper', 'admin']}});
		Meteor.rooms.insert({name: "Admin Room", aroom: true, guests: true, invite: false, limits: {role: ['admin']}});
	}
});



/* Observe Collections
 *********************/

Meteor.users.find({"status.online": true}).observe({
	added: function (user) {
		// user just came online
		var droom = Meteor.rooms.findOne({droom: true})._id;
		var status = Meteor.users.findOne({_id: user._id}).status;
		if (status.disc !== false) {
			Meteor.users.update({_id: user._id}, {$set: {'status.disc': false}});
			Meteor.messages.insert({date: new Date(), room: droom, join: true, user: user._id});
		}
	},
	removed: function (user) {
		// user just went offline
		var droom = Meteor.rooms.findOne({droom: true})._id;

		Meteor.setTimeout(function () {
			var status = Meteor.users.findOne({_id: user._id}).status;
			if (!status.online && !status.disc) {
				Meteor.users.update({_id: user._id}, {$set: {'status.disc': true}});
				Meteor.messages.insert({date: new Date(), room: droom, quit: true, user: user._id});
			}
		}, 10000);
	}
});



/* Publishes
 ***********/

// public list of rooms --- needs limiting to rooms you can see.
Meteor.publish("rooms", function () {
	return Meteor.rooms.find({});
});

// publish messages per room --- needs checking on access to room
Meteor.publish("roomMessages", function (room) {
	return Meteor.messages.find({room: room});
});

// usernames and profiles are public --- maybes needs limiting to only who's online (unless admin)
Meteor.publish('usernames', function () {
	return Meteor.users.find({}, {fields: {username: 1, role: 1, profile: 1}});
});

// user status
Meteor.publish("userStatus", function () {
	if (Roles.userIsInRole(this.userId, ['owner', 'admin'], 'server')) {
		return Meteor.users.find({"status.online": true}, {fields: {"status.online": 1, "status.idle": 1, "status.lastActivity": 1, "status.lastLogin": 1, "banned.expires": 1, "banned.reason": 1, "muted": 1}});
	} else {
		return Meteor.users.find({"status.online": true}, {fields: {"status.online": 1, "status.idle": 1, "status.lastActivity": 1, "banned.expires": 1, "banned.reason": 1, "muted": 1}});
	}
});

// Roles
Meteor.publish(null, function () {
	return Meteor.roles.find({});
});

// Social Media Info to Admins

// Give authorized users access to sensitive data by group
Meteor.publish('adminInfo', function () {
	if (Roles.userIsInRole(this.userId, ['owner', 'admin'], 'server')) {
		return Meteor.users.find({}, {fields: {services: 1, status: 1, roles: 1}});
	} else {
		this.stop();
		return;
	}
});