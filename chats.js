Template.navChats.helpers({
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
