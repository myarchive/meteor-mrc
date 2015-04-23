Settings = new Mongo.Collection("settings");
Messages = new Mongo.Collection("messages");
Rooms = new Mongo.Collection("rooms");

if (Meteor.isServer) {
	if (Settings.find({}) === 0) {
		Settings.insert({
			singleroom: true,
			allowchats: false,
			sitename: "Chatrooms"
		});
	}

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
