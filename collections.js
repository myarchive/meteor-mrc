;(function () {

	Meteor.mrc = new Meteor.Collection("settings");
	Meteor.rooms = new Meteor.Collection("rooms");
	Meteor.messages = new Meteor.Collection("messages");


	Meteor.subscribe("rooms");
	droom = Meteor.rooms.findOne({droom: true});
	if (droom) {
		Meteor.subscribe("roomMessages", droom._id);
	}

});
