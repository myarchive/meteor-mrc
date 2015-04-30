Template.registerHelper('mrcShowAdmin', function () {
	var myroles = (Meteor.user().role) ? Meteor.user().role : 'guest';

	if ((myroles.indexOf('owner') > -1) || (myroles.indexOf('admin') > -1))
		return "navAdmin";
	return "";
});

Template.ausers.onRendered(function () {
	$('#ausers').DataTable();
});

Template.ausers.helpers({
	allUsers: function () {
		var index = 0;
		var owners = [];
		var admins = [];
		var staffs = [];
		var ausers = [];
		var guests = [];

		var users = Meteor.users.find({});
		users.forEach(function (user) {
			if (!user.role)
				guests.push(user._id);
			else {
				if (user.role.indexOf('owner') > -1)
					owners.push(user._id);
				else if (user.role.indexOf('admin') > -1)
					admins.push(user._id);
				else if (user.role.indexOf('staff') > -1)
					staffs.push(user._id);
				else if (user.role.indexOf('user') > -1)
					ausers.push(user._id);
				else
					guests.push(user._id);
			}
		});
		
		var html = '';
		
		owners.forEach(function(id) {
			var row = Meteor.users.findOne(id);
			index++;
			html += '<tr>';
			html += '<td>'+index+'</td>';
			html += '<td>'+row.profile.name+'</td>';
			html += '<td>'+row.username+'</td>';
			html += '<td>'+row.profile.gender+'</td>';
			
			var roles = 'Owner';
			if (row.role.indexOf('staff') > -1)
				roles += ', Staff';
			
			html += '<td>'+roles+'</td>';
			html += '<td>...</td>';
			html += '<td>...</td>';
			html += '</tr>';
		});
		admins.forEach(function(id) {
			var row = Meteor.users.findOne(id);
			index++;
			html += '<tr>';
			html += '<td>'+index+'</td>';
			html += '<td>'+row.profile.name+'</td>';
			html += '<td>'+row.username+'</td>';
			html += '<td>'+row.profile.gender+'</td>';
			
			var roles = 'Admin';
			if (row.role.indexOf('staff') > -1)
				roles += ', Staff';
			
			html += '<td>'+roles+'</td>';
			html += '<td>...</td>';
			html += '<td>...</td>';
			html += '</tr>';
		});
		staffs.forEach(function(id) {
			var row = Meteor.users.findOne(id);
			index++;
			html += '<tr>';
			html += '<td>'+index+'</td>';
			html += '<td>'+row.profile.name+'</td>';
			html += '<td>'+row.username+'</td>';
			html += '<td>'+row.profile.gender+'</td>';
			html += '<td>Staff</td>';
			html += '<td>...</td>';
			html += '<td>...</td>';
			html += '</tr>';
		});
		ausers.forEach(function(id) {
			var row = Meteor.users.findOne(id);
			index++;
			html += '<tr>';
			html += '<td>'+index+'</td>';
			html += '<td>'+row.profile.name+'</td>';
			html += '<td>'+row.username+'</td>';
			html += '<td>'+row.profile.gender+'</td>';
			html += '<td>User</td>';
			html += '<td>...</td>';
			html += '<td>...</td>';
			html += '</tr>';
		});
		guests.forEach(function(id) {
			var row = Meteor.users.findOne(id);
			var row = Meteor.users.findOne(id);
			index++;
			html += '<tr>';
			html += '<td>'+index+'</td>';
			html += '<td>'+row.profile.name+'</td>';
			html += '<td>'+row.username+'</td>';
			html += '<td>'+row.profile.gender+'</td>';
			html += '<td>Guest</td>';
			html += '<td>...</td>';
			html += '<td>...</td>';
			html += '</tr>';
		});
		
		return html;
	}
});


Template.navAdmin.events({
	'click #ausers': function () {
		bootbox.dialog({
			title: "All Users",
			message: Blaze.toHTMLWithData(Template.ausers),
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
