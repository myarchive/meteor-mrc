Template.mrc.helpers({
	connectStatus: function () {
		if (!Meteor.status().connected) {
			var t = Session.get('timer');
			var ww = window.innerWidth || document.body.clientWidth;
			var left = (ww / 2) - 250;
			var dur = Math.floor((Meteor.status().retryTime - new Date().getTime()) / 1000);
			if (!isNaN(dur))
				return '<div id="connectStatus" class="alert alert-warning timer-' + t + '" role="alert" style="position:absolute; top:60px; left:' + left + 'px; width: 500px; z-index: 99999;"><strong>Disconnected:</strong> Attempting reconnect in ' + dur + ' seconds or try <a onclick="Meteor.reconnect()">now</a>... <small style="opacity: 0.6; margin-top: -10px;">(' + Meteor.status().retryCount + ')</small></div>';
		}
		return '';
	},
	mrcLoadBase: function () {
		if (Meteor.user()) {
			if (isBanned(Meteor.user()._id)) {
				var t = Session.get('timer');
				t = t; // hack to make reactive
				if (new Date() < Meteor.user().banned.expires)
					analytics.page('banned');
				return (Template["my_banned"]) ? "my_banned" : "mrc_banned";
			}
			if (!Meteor.user().profile || !Meteor.user().profile.name || !Meteor.user().profile.gender || !Meteor.user().username) {
				analytics.page('signup');
				return "mrc_newuser";
			} else {
				analytics.page('base');
				return "mrc_base";
			}
		}
		else {
			analytics.page('login');
			return (Template["my_login"]) ? "my_login" : "mrc_login";
		}
	}
});

Template.registerHelper('mrcBanExpires', function () {
		var t = Session.get('timer');
		var exp = Meteor.user().banned.expires;
		return moment(exp).fromNow(true);
});
Template.registerHelper('mrcBanReason', function () {
		return Meteor.user().banned.reason;
});

Template.mrc_base.helpers({
	'mrcLoadBrand': function () {
		return (Template["my_brand"]) ? "my_brand" : "mrc_brand";
	},
	'username': function () {
		return Meteor.user().profile.name;
	},
	'sendBox': function () {
		if (isMuted(Meteor.user()._id)) {
			var html = '<form id="mrc-muted-send" style="margin:0;padding:0;display:inline;position:relative;" onclick="return false;">';
			html += '<input id="mrc-muted-input" placeholder="You have been temporarily muted by server staff.." style="height:100%; width:100%; padding-right: 75px; background: #ccc" disabled>';
			html += '<button id="muted-submit" name="muted-submit" class="btn btn-warning" style="position:absolute;top:-8px;right:3px; opacity: 0.4">Muted</button>';
			html += '</form';			
		} else {
			var html = '<form id="mrc-send" style="margin:0;padding:0;display:inline;position:relative;">';
			html += '<input id="mrc-input" placeholder="Enter message here" style="height:100%; width:100%; padding-right: 75px;">';
			html += '<button id="submit" name="submit" class="btn btn-primary" style="position:absolute;top:-8px;right:3px">Send</button>';
			html += '</form';
		}
		return html;
	},
	'messages': function () {
		// Session get roomID for multiroom
		var myrole = (Meteor.user().role) ? Meteor.user().role : 'guest';
		var messages = Meteor.messages.find({room: Session.get('currRoom')}, {sort: {date: 1}});
		var html = '';
		messages.forEach(function (msg) {
			var user = Meteor.users.findOne(msg.user);
			if (user && user._id) {
				//var nick = user.username;
				var nick = user.profile.name;
				var time = new Date(msg.date);
				var h = (time.getHours() < 10) ? '0' + time.getHours() : time.getHours();
				var m = (time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes();

				var da = time.getDate(); // Date
				var da = (da < 10) ? '0' + da : da;
				var mo = time.getMonth() + 1; // Month (0 based, so add 1)
				var mo = (mo < 10) ? '0' + mo : mo;
				var yr = time.getYear() + 1900; // Year (since 1900 so add that)

				if (msg.join) {
					if (msg.user === Meteor.user()._id)
						html += '<p class="myjoin"><span class="time">' + yr + '-' + mo + '-' + da + ' ' + h + ':' + m + '</span> *** You have joined the room.</p>';
					else
						html += '<p class="join"><span class="time">' + yr + '-' + mo + '-' + da + ' ' + h + ':' + m + '</span> *** ' + nick + ' has joined the room.</p>';
				}
				else if (msg.part) {
					if (msg.user === Meteor.user()._id)
						html += '<p class="mypart"><span class="time">' + yr + '-' + mo + '-' + da + ' ' + h + ':' + m + '</span> *** You have left the room.</p>';
					else
						html += '<p class="part"><span class="time">' + yr + '-' + mo + '-' + da + ' ' + h + ':' + m + '</span> *** ' + nick + ' has left the room.</p>';
				}
				else if (msg.quit) {
					if (msg.user === Meteor.user()._id)
						html += '<p class="myquit"><span class="time">' + yr + '-' + mo + '-' + da + ' ' + h + ':' + m + '</span> *** You have disconnected.</p>';
					else
						html += '<p class="quit"><span class="time">' + yr + '-' + mo + '-' + da + ' ' + h + ':' + m + '</span> *** ' + nick + ' has disconnected.</p>';
				}
				else if (msg.message) {
					var self = (msg.user === Meteor.user()._id) ? 'self' : 'name';
					if (myrole === 'guest' || myrole === 'user')
						var goru = 'usr';
					else
						var goru = (user.role) ? 'usr' : 'gue';
					html += '<p class="msg ' + self + '"><span class="time">' + yr + '-' + mo + '-' + da + ' ' + h + ':' + m + '</span> <span class="' + self + ' ' + goru + '" alt="' + user.username + '">' + nick + ':</span> ' + escapeHtml(msg.message) + '</p>';
				}
			}
		});

		if (isAtBottom()) {
			scrollToBottom();
		} else {
			//increase unread
		}

		return html;
	},
	'roomName': function () {
		if (Roles.userIsInRole(Meteor.user()._id, ['owner', 'admin', 'staff', 'user'], 'server')) {
			var room = Meteor.rooms.findOne(Session.get('currRoom')).name;
			return '<h1>' + room + '</h1>';
		}
		return false;
	},
	'roomUsers': function () {
		if (!Session.get('currRoom') || !Meteor.rooms.findOne(Session.get('currRoom')))
			return false;
		var t = Session.get('timer');
		t = t;
		var room = Meteor.rooms.findOne(Session.get('currRoom'));
		var loop = ['mods', 'vips', 'joined'];
		var skip = [];
		var html = '';

		loop.forEach(function (rank) {
			var users = room[rank];
			users.forEach(function (uid) {
				if (skip.indexOf(uid) < 0) {
					var user = Meteor.users.findOne(uid);
					if (user && user.status && user.status.online) {
						var self = (uid === Meteor.user()._id) ? 'self' : '';
						var stat = (user.status && user.status.idle) ? 'idle' : '';
						var name = (user.profile && user.profile.name) ? user.profile.name : '...';
						var unam = (user.username) ? user.username : '_';
						if (user && user.banned && user.banned.expires > new Date() && Roles.userIsInRole(Meteor.user()._id, ['owner', 'admin', 'staff'], 'server')) {
							html += '<p id="mrcna-' + unam + '" class="banned">' + name + '</p>';
							mrcnaCM(unam, room._id, 'banned');
						} else if (user && user.muted) {
							html += '<p id="mrcna-' + unam + '" class="' + rank + '-muted">' + name + '</p>';
							mrcnaCM(unam, room._id, rank + '-muted');
						} else {
							html += '<p id="mrcna-' + unam + '" class="' + rank + '"><span class="' + stat + ' ' + self + '">' + name + '</span></p>';
							mrcnaCM(unam, room._id, rank);
						}
						skip.push(uid);
					}
				}
			});
		});
		return html;
	}
});

function escapeHtml(unsafe) {
	return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
}

function mrcnaCM(unam, rid, rank) {
	if ($('#mrcna-' + unam + '.' + rank).length)
		return false;

	var items = {};
	var user = Meteor.users.findOne({username: unam});
	var self = Meteor.user()._id;
	var targ = user._id;
	var room = Meteor.rooms.findOne({_id: rid});
	var sero = (room.droom || room.sroom || room.aroom) ? true : false;

	if (self === targ) {
		items['whois'] = {name: 'WhoAmI'};
	} else if (sero) {
		if (isOwner(targ) && hasStaff(self)) {
			items['owner'] = {name: 'OWNER'};
			items['sep0'] = '-';
		}
		if (isAdmin(targ) && isOwner(self)) {
			items['demstf'] = {name: 'Demote to Staff'};
			items['demusr'] = {name: 'Demote to User'};
			items['sep1'] = '-';
			if (user.muted)
				items['mute'] = {name: 'Un-mute User'};
			else
				items['mute'] = {name: 'Mute User'};
			items['sep2'] = '-';
		}
		if (isStaff(targ) && isOwner(self)) {
			items['proadm'] = {name: 'Promote to Admin'};
			items['sep3'] = '-';
		}
		if (isStaff(targ) && hasAdmin(self)) {
			items['demusr'] = {name: 'Demote to User'};
			items['sep4'] = '-';
			if (user.muted)
				items['mute'] = {name: 'Un-mute User'};
			else
				items['mute'] = {name: 'Mute User'};
			items['sep5'] = '-';
		}
		if (isUser(targ) && isOwner(self)) {
			items['proadm'] = {name: 'Promote to Admin'};
		}
		if (isUser(targ) && hasAdmin(self)) {
			items['prostf'] = {name: 'Promote to Staff'};
			items['sep6'] = '-';
			if (user.muted)
				items['mute'] = {name: 'Un-mute User'};
			else
				items['mute'] = {name: 'Mute User'};
			items['sep7'] = '-';
		}
		if (isGuest(targ) && hasStaff(self)) {
			items['regusr'] = {name: 'Register as User'};
			items['sep8'] = '-';
		}
		if ((isGuest(targ) || isUser(targ)) && hasStaff(self)) {
			if (user.muted)
				items['mute'] = {name: 'Un-mute User'};
			else
				items['mute'] = {name: 'Mute User'};
			if (isBanned(targ))
				items['unban'] = {name: 'Un-ban User'};
			else
				items['ban'] = {name: 'Ban User'};
			items['sep9'] = '-';
		}
		items['whois'] = {name: 'WhoIs'};
	} else {
		// Custom room...
		items['whois'] = {name: 'WhoIs'};
	}

	$.contextMenu({
		selector: '#mrcna-' + unam + '.' + rank,
		trigger: 'left',
		items: items,
		callback: function (key) {
			mrcnaCA(key, unam, rank);
		}
	});
}

function mrcnaCA(key, unam, rank) {
	var user = Meteor.users.findOne({username: unam});
	if (key === 'whois') {
		var html = '<div class="container">';
		html += '<div class="row"><div class="col-sm-4" style="font-weight: 900;">Username:</div></div class="col-sm-4">' + unam + '</div></div>';
		html += '<div class="row"><div class="col-sm-4" style="font-weight: 900;">Gender:</div></div class="col-sm-4">' + user.profile.gender + '</div></div>';

		if (user.status && user.status.idle) {
			var lastSeen = moment(user.status.lastActivity).fromNow();
			html += '<div class="row"><div class="col-sm-4" style="font-weight: 900;">Status:</div></div class="col-sm-4"><span style="color:#FF9900">Idle </span>(' + lastSeen + ')</div></div>';
		}
		else {
			html += '<div class="row"><div class="col-sm-4" style="font-weight: 900;">Status:</div></div class="col-sm-4"><span style="color:#009933">Online</span></div></div>';
		}
		html += '</div>';

		bootbox.dialog({
			title: 'Whois ' + user.profile.name,
			message: html,
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

	if (key === 'regusr') {
		Meteor.call('updateRoles', user._id, 'user', function (err, res) {
			if (res)
				$.contextMenu('destroy', '#mrcna-' + unam + '.' + rank);
		});
	}

	if (key === 'prostf') {
		Meteor.call('updateRoles', user._id, 'staff', function (err, res) {
			if (res)
				$.contextMenu('destroy', '#mrcna-' + unam + '.' + rank);
		});
	}

	if (key === 'proadm') {
		Meteor.call('updateRoles', user._id, 'admin', function (err, res) {
			if (res)
				$.contextMenu('destroy', '#mrcna-' + unam + '.' + rank);
		});
	}

	if (key === 'demstf') {
		Meteor.call('updateRoles', user._id, 'staff', function (err, res) {
			if (res)
				$.contextMenu('destroy', '#mrcna-' + unam + '.' + rank);
		});
	}

	if (key === 'demusr') {
		Meteor.call('updateRoles', user._id, 'user', function (err, res) {
			if (res)
				$.contextMenu('destroy', '#mrcna-' + unam + '.' + rank);
		});
	}

	if (key === 'mute') {
		Meteor.call('toggleMute', user._id, function (err, res) {
			if (res)
				$.contextMenu('destroy', '#mrcna-' + unam + '.' + rank);
		});
	}

	if (key === 'ban') {
		bootbox.dialog({
			title: 'Ban ' + user.profile.name,
			message: Blaze.toHTMLWithData(Template.mrc_ban_form),
			onEscape: true,
			closeButton: true,
			buttons: {
				alert: {
					label: "Ban",
					className: "btn-primary",
					callback: function () {
						var res = validateBanForm(true);
						if (res) {
							var dur = $('#duration').val();
							var rea = $('#reason').val();

							Meteor.call('ban', user._id, dur, rea, function (err, res) {
								if (res)
									$.contextMenu('destroy', '#mrcna-' + unam + '.' + rank);
							});
							return true;
						} else {
							return false;
						}
					}
				}
			}
		});
		$("#banform").keyup(function () {
			validateBanForm(false);
		});
	}

	if (key === 'unban') {
		Meteor.call('unban', user._id, function (err, res) {
			if (res)
				$.contextMenu('destroy', '#mrcna-' + unam + '.' + rank);
		});
	}

}

function validateBanForm(submit) {
	var form = {};
	$.each($('#banform').serializeArray(), function () {
		form[this.name] = this.value;
	});

	$('.help-block').remove();
	$('.form-group').removeClass('has-error');
	$('.form-group').removeClass('has-warning');
	$('.form-group').removeClass('has-success');
	var num = /^[0-9]+$/i;
	var err = false;

	// Duration Validation
	if (submit && form.duration === "") {
		$('#duration').parent().parent().parent().addClass('has-error');
		$('#duration').after('<span class="help-block">Required</span>');
		err = true;
	}
	else if (form.duration && form.duration !== "" && !num.test(form.duration)) {
		$('#duration').parent().parent().parent().addClass('has-error');
		$('#duration').after('<span class="help-block">Numbers only</span>');
		err = true;
	}
	else if (form.duration && form.duration !== "" && form.duration < 1) {
		$('#duration').parent().parent().parent().addClass('has-error');
		$('#duration').after('<span class="help-block">Minimum 1 minute</span>');
		err = true;
	}
	else if (form.duration && form.duration !== "" && form.duration > 10080) {
		$('#duration').parent().parent().parent().addClass('has-error');
		$('#duration').after('<span class="help-block">Maximum 1 week (10080m)</span>');
		err = true;
	}
	else if (form.duration && form.duration !== "") {
		$('#duration').parent().parent().parent().addClass('has-success');
	}

	// Reason Validation
	if (submit && form.reason === "") {
		$('#reason').parent().parent().addClass('has-error');
		$('#reason').after('<span class="help-block">Required</span>');
		err = true;
	}
	else if (form.reason && form.reason !== "" && (form.reason.length < 3 || form.reason.length > 100)) {
		$('#reason').parent().parent().addClass('has-error');
		$('#reason').after('<span class="help-block">Between 3 and 100 characters</span>');
		err = true;
	}
	else if (form.reason && form.reason !== "") {
		$('#reason').parent().parent().addClass('has-success');
	}

	if (err)
		return false;

	return true;
}
