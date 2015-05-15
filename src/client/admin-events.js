Template.ausr.onRendered(function () {
	$('#ausr').DataTable();
});

Template.navAdmin.events({
	'click #ausr': function () {
		bootbox.dialog({
			title: "All Users",
			message: Blaze.toHTMLWithData(Template.ausr),
			onEscape: true,
			closeButton: true,
			className: "bigModal"
		});
	},
	'click #aset': function () {
		bootbox.dialog({
			title: "Server Settings",
			message: Blaze.toHTMLWithData(Template.aset),
			onEscape: true,
			closeButton: true,
			buttons: {
				alert: {
					label: "Save",
					className: "btn-primary",
					callback: function () {
						alert('!!!');
						bootbox.hideAll();
					}
				}
			}
		});
	},
	'click #asrv': function () {
		bootbox.dialog({
			title: "Server Setup (owner only)",
			message: Blaze.toHTMLWithData(Template.asrv),
			onEscape: true,
			closeButton: true,
			buttons: {
				alert: {
					label: "Save",
					className: "btn-primary",
					callback: function () {
						alert('!!!');
						bootbox.hideAll();
					}
				}
			}
		});
	}
});
