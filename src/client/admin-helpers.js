Template.ausers.helpers({
	allUsers: function () {
		var t = Session.get('timer');
		var index = 0;
		var html = '';
		var roles = ['owner', 'admin', 'staff', 'user', null];

		roles.forEach(function (role) {
			var res = Meteor.users.find({"roles.server": role}, {sort: {"profile.name": 1}});
			res.forEach(function (user) {
				index++;
				var sma = '';
				if (user.services) {
					if (user.services.facebook)
						sma = (sma === '') ? '<a href="' + user.services.facebook.link + '" target="_blank">FB</a>' : sma + ', <a href="' + user.services.facebook.link + '" target="_blank">FB</a>';
				}
				
				var status = (user.status.online) ? 'Online' : '';				

				role = (role === null) ? '' : role;
				html += '<tr>';
				html += '<td>' + index + '</td>';
				html += '<td>' + user.profile.name + '</td>';
				html += '<td>' + user.username + '</td>';
				html += '<td>' + user.profile.gender + '</td>';
				html += '<td>' + capFirst(role) + '</td>';
				html += '<td class="'+status.toLowerCase()+'">' + status + '</td>';

				if (user.status && user.status.lastLogin && user.status.lastLogin.date) {
					var disp = (moment(user.status.lastLogin.date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) ? 'Today' : moment(user.status.lastLogin.date).format("YYYY-MM-DD");
					html += '<td><a style="color:#444" data-toggle="tooltip" data-placement="top" title="' + moment(user.status.lastLogin.date).format("YYYY-MM-DD HH:mm:ss") + '<br>(' + moment(user.status.lastLogin.date).fromNow() + ')<br>' + user.status.lastLogin.ipAddr + '<br><br><small>' + user.status.lastLogin.userAgent + '</small>">' + disp + '</a></td>';
				} else {
					html += '<td>-</td>';
				}
				html += '<td>' + sma + '</td>';
				html += '<td><i id="edit-' + user.username + '" class="fa fa-edit"></i></td>';
				html += '</tr>';
				mrcauCM(user);
			});
		});

		setTimeout(function () {
			$('[data-toggle="tooltip"]').tooltip({html: true});
			$('table#ausers').DataTable({
				"bPaginate": false,
				"bInfo": false,
				"bLengthChange": false
			});
		}, 500);
		return html;
	}
});

function mrcauCM(user) {
	var items = {};

	if (Meteor.user()._id === user._id) {
		items['self'] = {name: 'Edit From Profile'};
	}
	else {
		// OWNER
		if (Roles.userIsInRole(user._id, 'owner', 'server')) {
			items['noedit'] = {name: 'Can not edit owner'};
		}
		// ADMIN
		else if (Roles.userIsInRole(user._id, 'admin', 'server')) {
			if (Roles.userIsInRole(Meteor.user()._id, 'owner', 'server')) {
				items['demhlp'] = {name: 'Demote to staff'};
			}
			else {
				items['noedit'] = {name: 'Can not edit other admins'};
			}
		}
		// STAFF
		else if (Roles.userIsInRole(user._id, 'staff', 'server')) {
			if (Roles.userIsInRole(Meteor.user()._id, 'owner', 'server')) {
				items['proadm'] = {name: 'Promote to Admin'};
			}
			else {
				items['demusr'] = {name: 'Demote to User'};
			}
		}
		// USER
		else if (Roles.userIsInRole(user._id, 'user', 'server')) {
			if (Roles.userIsInRole(Meteor.user()._id, 'owner', 'server')) {
				items['proadm'] = {name: 'Promote to Admin'};
				items['prostf'] = {name: 'Promote to Staff'};
			}
			else {
				items['prostf'] = {name: 'Promote to Staff'};
			}
		}
		// GUEST
		else {
			items['regusr'] = {name: 'Register User'};
		}

		items['esep'] = "-";
		items['edit'] = {name: 'Edit'};
	}

	$.contextMenu({
		selector: '#edit-' + user.username,
		trigger: 'left',
		items: items,
		callback: function (key) {
			mrcauCA(key, user);
		}
	});
}

function mrcauCA(key, user) {
	if (key === 'edit') {
		alert('edit!');
	}

}
