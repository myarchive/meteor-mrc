if (!Meteor.mrc) {
	Meteor.mrc = new Meteor.Collection("mrc");
}
if (!Meteor.rooms) {
	Meteor.rooms = new Meteor.Collection("rooms");
	Meteor.rooms._ensureIndex('name', {unique: 1});
}
if (!Meteor.messages) {
	Meteor.messages = new Meteor.Collection("messages");
}

// Default settings
if (Meteor.mrc.find({}).count() === 0) {
	mrc = Meteor.mrc.insert({
		sitename: "MRC+", // Your site name
		privserver: false, // Prevents guests from seeing even default room.  Once signed in an admin must promote to use before use.
		guestrooms: false, // Can guests see rooms? (other than default room)
		guestchats: false, // Can guests use chat system?
		guestsuppo: false  // Can guests use support?
	});
}

// Default rooms
if (Meteor.rooms.find({}).count() === 0) {
	droom = Meteor.rooms.insert({
		name: "Main Room", // Server's default room
		droom: true, // Only one room will have this..
		force: true, // Force joining this room if user can join
		guests: true, // Allow guests
		invite: false, // Invite only room
		limits: false		// Limits on who can see/join/etc.
	});
	sroom = Meteor.rooms.insert({
		name: "Staff Room", // Server's staff room (admins+helpers)
		sroom: true, // Only one room will have this..
		guests: false,
		invite: false,
		limits: {
			role: ['helper', 'admin']
		}
	});
	aroom = Meteor.rooms.insert({
		name: "Admin Room", // Server's admin room
		aroom: true, // Only one room will have this..
		guests: true,
		invite: false,
		limits: {
			role: ['admin']
		}
	});
}

// Default users - for testing!
if (Meteor.users.find().count() === 0) {
	guest = Accounts.createUser({
		username: 'test1',
		email: 'test1@mrc.com',
		password: 'password',
		profile: {
			name: 'Test One',
			gender: 'female'
		}
	});
	user = Accounts.createUser({
		username: 'test2',
		email: 'test2@mrc.com',
		password: 'password',
		role: 'user',
		profile: {
			name: 'Test Two',
			gender: 'male'
		}
	});
	helper = Accounts.createUser({
		username: 'test3',
		email: 'test3@mrc.com',
		password: 'password',
		role: 'helper',
		profile: {
			name: 'Test Three',
			gender: 'female'
		}
	});
	admin = Accounts.createUser({
		username: 'test4',
		email: 'test4@mrc.com',
		password: 'password',
		role: 'admin',
		profile: {
			name: 'Test Four',
			gender: 'male'
		}
	});
	user1 = Accounts.createUser({
		username: 'test5',
		email: 'test5@mrc.com',
		password: 'password',
		role: 'user',
		profile: {
			name: 'Test Five',
			gender: 'male'
		}
	});
	user2 = Accounts.createUser({
		username: 'test6',
		email: 'test6@mrc.com',
		password: 'password',
		role: 'user',
		profile: {
			name: 'Test Six',
			gender: 'male'
		}
	});
	user3 = Accounts.createUser({
		username: 'test7',
		email: 'test7@mrc.com',
		password: 'password',
		role: 'user',
		profile: {
			name: 'Test Seven',
			gender: 'male'
		}
	});
}

// For testing! - Room roles
// Default room based on network roles!
// This will become dynamic based on whenever roles are changed
Meteor.rooms.update(droom, {$set: {
		mods: [
			admin
		],
		vips: [
			helper
		],
		joined: [
			guest,
			user,
			helper,
			admin,
			user1,
			user2,
			user3
		]
	}});
Meteor.rooms.update(sroom, {$set: {
		mods: [
			admin
		],
		vips: [
			helper
		],
		joined: [
			helper,
			admin
		]
	}});
Meteor.rooms.update(aroom, {$set: {
		mods: [
			// OWNER
		],
		vips: [
			admin
		],
		joined: [
			admin
		]
	}});

// server: publish the rooms collection, minus secret info.
Meteor.publish("rooms", function () {
	return Meteor.rooms.find({}, {fields: {secretInfo: 0}});
});

// publish dependent documents and simulate joins
Meteor.publish("roomMessages", function (room) {
	return Meteor.messages.find({room: room});
});

// Presence
Meteor.publish('usernames', function () {
	return Meteor.users.find({}, {fields: {username: 1, profile: 1}});
});

Meteor.publish('userPresence', function () {
	// Setup some filter to find the users your user
	// cares about. It's unlikely that you want to publish the 
	// presences of _all_ the users in the system.

	// If for example we wanted to publish only logged in users we could apply:
	// filter = { userId: { $exists: true }};
	var filter = {};

	return Presences.find(filter, {fields: {state: true, userId: true}});
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