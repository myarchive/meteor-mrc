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
	$(window).resize(function () { renderEnv(); });
	setTimeout(function () { scrollToBottom(); }, 200);
	setTimeout(function () { scrollToBottom(); }, 500);
	if (!Session.get('currRoom')) Session.set('currRoom',Meteor.rooms.findOne({droom:true})._id);
	Meteor.call('onConnect', function() {
		var rooms = Meteor.rooms.find({joined: Meteor.user()._id});
		var roomids = [];
		rooms.forEach(function (room) {
			roomids.push(room._id);
		});
		Session.set('myRooms', roomids);
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
			var user = Meteor.users.findOne(msg.sender);
			//var nick = user.username;
			var nick = user.profile.name;
			var time = new Date(msg.date);
			var h = (time.getHours() < 10) ? '0' + time.getHours() : time.getHours();
			var m = (time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes();
			
			var self = (msg.sender === Meteor.user()._id) ? 'self' : 'name';
			if (myrole === 'guest' || myrole === 'user') var goru = 'usr';
			else var goru = (user.role) ? 'usr' : 'gue';
			html += '<p class="'+self+'"><span class="time">' + h + ':' + m + '</span> <span class="'+self+' '+goru+'" alt="'+user.username+'">' + nick + ':</span> ' + msg.message + '</p>';
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
			return '<h1>'+room+'</h1>';
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
		var skip = [];
		var html = '';
		room.mods.forEach(function(mod) {
			if (room.joined.indexOf(mod) > -1) {
				var user = Meteor.users.findOne(mod);
				//var nick = (user.username) ? user.username : '...';
				var self = (mod === Meteor.user()._id) ? 'self' : '';
				var stat = (user.status.idle) ? 'idle' : 'active';
				var nick = (user.profile && user.profile.name) ? user.profile.name : '...';
				html += '<p class="mod '+stat+' '+self+'">' + nick + '</p>';
				skip.push(mod);
			}
		});
		room.vips.forEach(function(vip) {
			if (room.joined.indexOf(vip) > -1) {
				var user = Meteor.users.findOne(vip);
				//var nick = (user.username) ? user.username : '...';
				var self = (vip === Meteor.user()._id) ? 'self' : '';
				var stat = (user.status.idle) ? 'idle' : 'active';
				var nick = (user.profile && user.profile.name) ? user.profile.name : '...';
				html += '<p class="mod '+stat+' '+self+'">' + nick + '</p>';
				skip.push(vip);
			}
		});		
		room.joined.forEach(function (uid) {
			if (skip.indexOf(uid) < 0) {
				var user = Meteor.users.findOne(uid);
				//var nick = (user.username) ? user.username : '...';
				var self = (uid === Meteor.user()._id) ? 'self' : '';
				var stat = (user.status.idle) ? 'idle' : 'active';
				var nick = (user.profile && user.profile.name) ? user.profile.name : '...';
				
				if (myrole === 'guest' || myrole === 'user') var goru = 'usr';
				else var goru = (user.role) ? 'usr' : 'gue';
				html += '<p class="'+goru+' '+stat+' '+self+'">' + nick + '</p>';
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
			sender: Meteor.user()._id,
			room: Session.get('currRoom'),
			message: message
		}, function (err) {
			if (err)
				return false;
			return true;
		});
	},
	'click span.name': function(e) {
		var uname = e.target.attributes.alt.value;
		var input = $('#mrc-input').val();
		$('#mrc-input').val('@'+uname+' '+input).focus();
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
