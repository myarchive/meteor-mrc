Template.navRooms.helpers({
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
