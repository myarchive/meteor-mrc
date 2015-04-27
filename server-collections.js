;(function () {

	if (!Meteor.mrc) {
		Meteor.mrc = new Meteor.Collection("settings");
		Meteor.mrc._ensureIndex('id', {unique: 1});
	}
	if (!Meteor.rooms) {
		Meteor.rooms = new Meteor.Collection("rooms");
		Meteor.rooms._ensureIndex('name', {unique: 1});
	}
	if (!Meteor.messages) {
		Meteor.messages = new Meteor.Collection("messages");
		Meteor.messages._ensureIndex('id', {unique: 1});
	}

	// server: publish the rooms collection, minus secret info.
	Meteor.publish("rooms", function () {
		return Meteor.rooms.find({}, {fields: {secretInfo: 0}});
	});

	// publish dependent documents and simulate joins
	Meteor.publish("roomMessages", function (room) {
		return Meteor.messages.find({room: room});
	});

	// Default settings
	if (Meteor.mrc.find({}) === 0) {
		Meteor.mrc.insert({
			sitename: "MRC+", // Your site name
			privserver: false, // Prevents guests from seeing even default room.  Once signed in an admin must promote to use before use.
			guestrooms: false, // Can guests see rooms? (other than default room)
			guestchats: false, // Can guests use chat system?
			guestsuppo: false  // Can guests use support?
		});
	}

	// Default rooms
	if (Meteor.rooms.find({}) === 0) {
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
	Meteor.rooms.update({_id: droom}, {$set: {
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
	Meteor.rooms.update({_id: sroom}, {$set: {
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
	Meteor.rooms.update({_id: aroom}, {$set: {
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

	// For testing! - Create test messages
	if (Meteor.messages.find({}) === 0) {
		Meteor.messages.insert({
			date: new Date(),
			sender: guest,
			room: droom,
			message: 'Lorem ipsum 1'
		});
		Meteor.messages.insert({
			date: new Date(),
			sender: user,
			room: droom,
			message: 'Lorem ipsum 2'
		});
		Meteor.messages.insert({
			date: new Date(),
			sender: helper,
			room: droom,
			message: 'Lorem ipsum 3'
		});
		Meteor.messages.insert({
			date: new Date(),
			sender: admin,
			room: droom,
			message: 'Lorem ipsum 4'
		});
		Meteor.messages.insert({
			date: new Date(),
			sender: user1,
			room: droom,
			message: 'Lorem ipsum 5'
		});
		Meteor.messages.insert({
			date: new Date(),
			sender: user2,
			room: droom,
			message: 'Lorem ipsum 6'
		});
		Meteor.messages.insert({
			date: new Date(),
			sender: user3,
			room: droom,
			message: 'Lorem ipsum 7'
		});
	}

}());

// ... and publish secret info for rooms where the logged-in user
// is an admin. If the client subscribes to both streams, the records
// are merged together into the same documents in the Rooms collection.
//	Meteor.publish("adminSecretInfo", function () {
//		return Rooms.find({admin: this.userId}, {fields: {secretInfo: 1}});
//	});
