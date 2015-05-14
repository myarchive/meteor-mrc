Template.ausers.onRendered(function () {
	$('#ausers').DataTable();
});

Template.navAdmin.events({
	'click #ausers': function () {
		bootbox.dialog({
			title: "All Users",
			message: Blaze.toHTMLWithData(Template.ausers),
			onEscape: true,
			closeButton: true,
			className: "bigModal",
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
