Meteor.mrc = new Meteor.Collection("mrc");
Meteor.rooms = new Meteor.Collection("rooms");
Meteor.rooms._ensureIndex('name', {unique: 1});
Meteor.messages = new Meteor.Collection("messages");

// Default settings
if (Meteor.mrc.find({}).count() === 0) {
	mrc = Meteor.mrc.insert({
		sitename: 'MRC+', // Your site name
		privserver: false, // Prevents guests from seeing even default room.  Once signed in an admin must promote to use before use.
		guestrooms: false, // Can guests see rooms? (other than default room)
		guestchats: false, // Can guests use chat system?
		guestsuppo: false  // Can guests use support?
	});
}

// Default rooms
if (Meteor.rooms.find({}).count() === 0) {
	Meteor.rooms.insert({ name: "Main Room", droom: true, force: true, guests: true, invite: false, limits: false });
	Meteor.rooms.insert({ name: "Staff Room", sroom: true, guests: false, invite: false, limits: { role: ['helper', 'admin'] } });
	Meteor.rooms.insert({ name: "Admin Room", aroom: true, guests: true, invite: false, limits: { role: ['admin'] } });
}

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

Meteor.messages.allow({
	insert: function (userId, doc) {
		// the user must be logged in, and the sender must be self
		// add room attendance rules here also...
		return (userId && doc.sender === userId);
	}
});

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
		if (!user.role)
			guests.push(user._id);
		else {
			if (user.role.indexOf('owner') > -1)
				owners.push(user._id);
			if (user.role.indexOf('admin') > -1)
				admins.push(user._id);
			if (user.role.indexOf('admin') > -1 && user.role.indexOf('owner') === 0)
				adminw.push(user._id);
			if (user.role.indexOf('staff') > -1 && user.role.indexOf('admin') === 0  && user.role.indexOf('owner') === 0)
				staffs.push(user._id);
			if (user.role.indexOf('user') > -1)
				ausers.push(user._id);
		}
	});
	Meteor.rooms.update({droom: true}, {$set: {mods: admins, vips: staffs}});
	Meteor.rooms.update({sroom: true}, {$set: {mods: admins, vips: staffs}});
	Meteor.rooms.update({aroom: true}, {$set: {mods: owners, vips: adminw}});
}, {fetchPrevious: false});


































// Default users - for testing!
if (Meteor.users.find().count() === 0) {
	ids = {};
	var users = [
		{user: 'owner', name: "Owner User", email: "owner@mrc.com", role: ['owner', 'admin']},
		{user: 'admin', name: "Admin User", email: "admin@mrc.com", role: 'admin'},
		{user: 'staff', name: "Staff User", email: "staff@mrc.com", role: 'staff'},
		{user: 'user', name: "User", email: "user@mrc.com", role: 'user'},
		{user: 'guest', name: "Guest", email: "guest@mrc.com"}
	];
	users.forEach(function (user) {
		var id = Accounts.createUser({
			email: user.email,
			password: "apple1",
			profile: {name: user.name, gender: 'male'}
		});

		Meteor.users.update({_id: id}, {$set: {username: user.user}});
		if (user.role)
			Meteor.users.update({_id: id}, {$set: {role: user.role}});
	});
}