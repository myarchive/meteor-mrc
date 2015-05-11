Meteor.mrc = new Meteor.Collection("mrc");
Meteor.rooms = new Meteor.Collection("rooms");
Meteor.messages = new Meteor.Collection("messages");


Meteor.subscribe("rooms", { onReady: function() { 
	Meteor.subscribe("roomMessages", Meteor.rooms.findOne({droom: true})._id);
}});

Meteor.subscribe('usernames');
Meteor.subscribe('userStatus');

// allow sending messages
Meteor.messages.allow({
	insert: function (userId, doc) {
		// the user must be logged in, and the sender must be self
		// add room attendance rules here also...
		// join, part, quit, etc. can not be sent by user rules here...
		// validate message format, etc. also...
		return (userId && doc.user === userId);
	}
});
