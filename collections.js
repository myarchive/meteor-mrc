Meteor.mrc = new Meteor.Collection("mrc");
Meteor.rooms = new Meteor.Collection("rooms");
Meteor.messages = new Meteor.Collection("messages");


Meteor.subscribe("rooms", { onReady: function() { 
	Meteor.subscribe("roomMessages", Meteor.rooms.findOne({droom: true})._id);
}});

Meteor.subscribe('usernames');
Meteor.subscribe('userStatus');

Meteor.messages.allow({
	insert: function (userId, doc) {
		// the user must be logged in, and the sender must be self
		// add room attendance rules here also...
		return (userId && doc.sender === userId);
	}
});
