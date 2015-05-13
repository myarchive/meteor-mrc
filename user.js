Template.navUser.helpers({
	'username': function () {
		return Meteor.user().profile.name;
	}
});

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

Template.body.events({
	'click #username': function () {
		alert('!!!');
		
		$('#username').parent().parent().addClass('has-error');
		$('#username').after('<span class="help-block erase1">Must submit a support ticket to change this.</span>');
		setTimeout(function () {
			$('.erase1').remove();
			$('#username').parent().parent().removeClass('has-error');
		}, 3000);
	}
});
