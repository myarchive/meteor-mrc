Template.registerHelper('mrcShowChats', function () {
	
	// Disable chats until adding feature in future version
	return "";
	
	var myroles = (Meteor.user().role) ? Meteor.user().role : 'guest';

	if (myroles !== 'guest')
		return "navChats";
	return "";
});

Template.navChats.helpers({
	currChats: function() {
		var html = '';
		return html;
	}
});
Template.navChats.events({
	'click #chats': function () {
		bootbox.dialog({
			title: "Chats",
			message: Blaze.toHTMLWithData(Template.chats),
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
