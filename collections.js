Settings = new Mongo.Collection("settings");
Messages = new Mongo.Collection("messages");
Rooms = new Mongo.Collection("rooms");

if (Meteor.isServer) {
	// Default settings
	if (Settings.find({}) === 0) {
		Settings.insert({
			sitename: "MRC+", // Your site name
			privserver: false, // Prevents guests from seeing even default room.  Once signed in an admin must promote to use before use.
			guestrooms: false, // Can guests see rooms? (other than default room)
			guestchats: false, // Can guests use chat system?
			guestsuppo: false  // Can guests use support?
		});
	}
	
	// Default room
	if (Rooms.find({}) === 0) {
		Rooms.insert({
			name: "Main Room",	// Server's default room
			droom: true			// Only one room will have this..
		});
		Rooms.insert({
			name: "Admin Room",	// Server's admin room
			aroom: true			// Only one room will have this..
		});
	}
	// invite: false // invite only? (by operator)
	// guests: false // allow guests?
	// limits: false // limit who can join room by conditions





	// server: publish the rooms collection, minus secret info.
	Meteor.publish("rooms", function () {
		return Rooms.find({}, {fields: {secretInfo: 0}});
	});

	// ... and publish secret info for rooms where the logged-in user
	// is an admin. If the client subscribes to both streams, the records
	// are merged together into the same documents in the Rooms collection.
	Meteor.publish("adminSecretInfo", function () {
		return Rooms.find({admin: this.userId}, {fields: {secretInfo: 1}});
	});

	// publish dependent documents and simulate joins
	Meteor.publish("roomAndMessages", function (roomId) {
		check(roomId, String);
		return [
			Rooms.find({_id: roomId}, {fields: {secretInfo: 0}}),
			Messages.find({roomId: roomId})
		];
	});
}

if (Meteor.isClient) {
//	Meteor.subscribe("settings");
//	Meteor.subscribe("messages");
	Meteor.subscribe("rooms");
}
