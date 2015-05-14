Template.navUser.events({
	'click #editp': function () {
		bootbox.dialog({
			title: "Edit Profile",
			message: Blaze.toHTML(Template.editp),
			onEscape: true,
			closeButton: true,
			backdrop: true,
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
	},
	'click #prefs': function () {
		bootbox.dialog({
			title: "Preferences",
			message: Blaze.toHTMLWithData(Template.prefs),
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
	},
	'click #suppo': function () {
		bootbox.dialog({
			title: "Support",
			message: Blaze.toHTMLWithData(Template.suppo),
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
	},
	'click #signo': function () {
		Meteor.logout(function () {
			// callback
		});
	},
});
