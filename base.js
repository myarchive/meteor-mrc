Template.registerHelper('mrcLoadBase', function () {
	if (Meteor.user())
		return (!Meteor.user().profile || !Meteor.user().username) ? "mrc_newuser" : "mrc_base";
	else
		return (Template["my_login"]) ? "my_login" : "mrc_login";
});

Template.registerHelper('mrcLoadBrand', function () {
	return (Template["my_brand"]) ? "my_brand" : "mrc_brand";
});

Template.mrc_base.onRendered(function () {
	renderEnv();
	$(window).resize(function () {
		renderEnv();
	});
	setTimeout(function () {
		scrollToBottom();
	}, 200);
	setTimeout(function () {
		scrollToBottom();
	}, 500);
	if (!Session.get('currRoom')) {
		var droom = Meteor.rooms.findOne({droom: true});
		var croom = (droom && droom._id) ? droom._id : null;
		Session.set('currRoom', croom);
	}
	Meteor.call('onConnect', function () {
		var rooms = Meteor.rooms.find({joined: Meteor.user()._id});
		var roomids = [];
		rooms.forEach(function (room) {
			roomids.push(room._id);
		});
		Session.set('myRooms', roomids);
		if (!Session.get('currRoom')) {
			var droom = Meteor.rooms.findOne({droom: true});
			var croom = (droom && droom._id) ? droom._id : null;
			Session.set('currRoom', croom);
		}
	});
	UserStatus.startMonitor({
		interval: '10000',
		threshold: '60000',
		idleOnBlur: true
	});
});

Template.mrc_base.helpers({
	'username': function () {
		return Meteor.user().profile.name;
	},
	'messages': function () {
		// Session get roomID for multiroom
		var myrole = (Meteor.user().role) ? Meteor.user().role : 'guest';
		var messages = Meteor.messages.find({room: Session.get('currRoom')}, {sort: {date: 1}});
		var html = '';
		messages.forEach(function (msg) {
			var user = Meteor.users.findOne(msg.user);
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
		});

		if (isAtBottom()) {
			scrollToBottom();
		} else {
			//increase unread
		}

		return html;
	},
	'roomName': function () {
		var myrole = (Meteor.user().role) ? Meteor.user().role : 'guest';
		if (myrole !== 'guest') {
			var room = Meteor.rooms.findOne(Session.get('currRoom')).name;
			return '<h1>' + room + '</h1>';
		}
		return false;
	},
	'roomUsers': function () {
		if (!Session.get('currRoom'))
			return false;
		var room = Meteor.rooms.findOne(Session.get('currRoom'));
		if (!room)
			return false;

		var myrole = (Meteor.user().role) ? Meteor.user().role : 'guest';
		var mods = (room.mods) ? room.mods : [];
		var vips = (room.vips) ? room.vips : [];
		var joined = (room.joined) ? room.joined : [];
		var skip = [];
		var html = '';
		mods.forEach(function (mod) {
			if (joined.indexOf(mod) > -1) {
				var user = Meteor.users.findOne(mod);
				if (user && user.status && user.status.online) {
					var self = (mod === Meteor.user()._id) ? 'self' : '';
					var stat = (user.status && user.status.idle) ? 'idle' : '';
					var nick = (user.profile && user.profile.name) ? user.profile.name : '...';
					var unam = (user.username) ? user.username : '...';
					html += '<p id="mrcna-' + unam + '" class="mod ' + stat + ' ' + self + '">' + nick + '</p>';
					mrcnaCM(unam, 'mod');
					skip.push(mod);
				}
			}
		});
		vips.forEach(function (vip) {
			if (joined.indexOf(vip) > -1) {
				var user = Meteor.users.findOne(vip);
				if (user && user.status && user.status.online) {
					var self = (vip === Meteor.user()._id) ? 'self' : '';
					var stat = (user.status && user.status.idle) ? 'idle' : 'active';
					var nick = (user.profile && user.profile.name) ? user.profile.name : '...';
					var unam = (user.username) ? user.username : '...';
					html += '<p id="mrcna-' + unam + '" class="vip ' + stat + ' ' + self + '">' + nick + '</p>';
					mrcnaCM(unam, 'vip');
					skip.push(vip);
				}
			}
		});
		joined.forEach(function (uid) {
			if (skip.indexOf(uid) < 0) {
				var user = Meteor.users.findOne(uid);
				if (user && user.status && user.status.online) {
					var self = (uid === Meteor.user()._id) ? 'self' : '';
					var stat = (user.status && user.status.idle) ? 'idle' : 'active';
					var nick = (user.profile && user.profile.name) ? user.profile.name : '...';

					if (myrole === 'guest' || myrole === 'user')
						var goru = 'usr';
					else
						var goru = (user.role) ? 'usr' : 'gue';
					var unam = (user.username) ? user.username : '...';
					html += '<p id="mrcna-' + unam + '" class="' + goru + ' ' + stat + ' ' + self + '">' + nick + '</p>';
					mrcnaCM(unam, null);
				}
			}
		});
		return html;
	}
});

Template.mrc_base.events({
	'click #brand': function () {
		var html = (Template["my_brand_pop"]) ? Blaze.toHTMLWithData(Template.my_brand_pop) : Blaze.toHTMLWithData(Template.mrc_brand_pop);
		bootbox.dialog({
			title: "About",
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
	},
	'submit #mrc-send': function (event) {
		event.preventDefault();
		var message = $('#mrc-input').val();
		$('#mrc-input').val('');
		Meteor.messages.insert({
			date: new Date(),
			user: Meteor.user()._id,
			room: Session.get('currRoom'),
			message: message
		}, function (err) {
			if (err)
				return false;
			return true;
		});
	},
	'click span.name': function (e) {
		var uname = e.target.attributes.alt.value;
		var input = $('#mrc-input').val();
		$('#mrc-input').val('@' + uname + ' ' + input).focus();
	}
});

function isAtBottom() {
	var out = document.getElementById("mrc-chatarea");
	if (!out)
		return false;
	var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
	return isScrolledToBottom;
}

function scrollToBottom() {
	var elm = document.getElementById("mrc-chatarea");
	var scr = elm.scrollHeight;
	$('#mrc-chatarea').animate({scrollTop: scr}, 'fast');
}

function renderEnv() {
	var h = $(window).height();
	$('#mrc-chatarea').css('height', h - 90 + 'px').css('top', '50px').css('padding', '0');
	$('#mrc-namearea').css('height', h - 50 + 'px');
}

function escapeHtml(unsafe) {
	return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
}

function mrcnaCM(user, rr) {
	var items = {};
	var myrole = (Meteor.user().role) ? Meteor.user().role : 'guest';

	if (Meteor.user().username === user) {
		// Self
		items['whois'] = {name: 'Whoami'};
	}
	else {
		// Others
		if (myrole.indexOf('owner') > -1) {
			if (rr === 'mod') {
				items['demvip'] = {name: 'Demote to VIP'};
				items['demusr'] = {name: 'Demote to User'};
				items['ownsep'] = "-----";
			}
			if (rr === 'vip') {
				items['demusr'] = {name: 'Demote to User'};
				items['ownsep'] = "-----";
			}
		}
		else if (myrole.indexOf('admin') > -1) {
			if (rr === 'vip') {
				items['demusr'] = {name: 'Demote to User'};
				items['ownsep'] = "-----";
			}
		}
		
		items['whois'] = {name: 'Whois'};
	}

	$.contextMenu({
		selector: '#mrcna-' + user,
		trigger: 'left',
		items: items,
		callback: function (key) {
			mrcnaCA(key, user);
		}
	});
}

function mrcnaCA(key, un) {
	if (key === 'whois') {
		var user = Meteor.users.findOne({username: un});
		console.log(user);

		var html = '<div class="container">';
		html += '<div class="row"><div class="col-sm-4" style="font-weight: 900;">Username:</div></div class="col-sm-4">' + un + '</div></div>';
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
}
