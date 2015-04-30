Template.registerHelper('mrcShowRooms', function () {
	var myroles = (Meteor.user().role) ? Meteor.user().role : 'guest';
	var myrooms = []; var rooms = Meteor.rooms.find({joined:Meteor.user()._id});
	rooms.forEach(function(room) { myrooms.push(room._id); });
	var curroom = (Session.get('currRoom')) ? Session.get('currRoom') : Meteor.rooms.findOne({droom:true})._id;
	Session.set('currRoom',curroom);

	if (myroles !== 'guest')
		return "navRooms";
	return "";
});

Template.navRooms.helpers({
	currRooms: function() {
		var rooms = Session.get('myRooms');
		var html = '';
		rooms.forEach(function (room) {
			var name = Meteor.rooms.findOne(room).name;
			var active = (Session.get('currRoom') == room) ? 'class="active"' : '';
			html += '<li '+active+'><a class="room"><i class="fa fa-slack"></i> '+name+'</a></li>';
		});
		return html;
	}
});

Template.navRooms.events({
	'click #rooms': function () {
		bootbox.dialog({
			title: "Rooms",
			message: Blaze.toHTMLWithData(Template.rooms),
			onEscape: true,
			closeButton: true,
			buttons: {
				alert: {
					label: "Ok",
					className: "btn-primary",
					callback: function () {
						bootbox.hideAll();
					}
				}
			}
		});
	}
});
