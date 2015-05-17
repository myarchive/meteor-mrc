Template.mrc.onRendered(function () {
	setInterval(function () {
		var t = (Session.get('timer') > 0) ? Session.get('timer') + 1 : 1;
		Session.set('timer', t);
	}, 1000);
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
	setTimeout(function () {
		scrollToBottom();
	}, 1000);
	setTimeout(function () {
		scrollToBottom();
	}, 2000);
	setTimeout(function () {
		scrollToBottom();
	}, 3000);
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
	analytics.page('base')
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
		analytics.track("Clicked logo");
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
		analytics.track("Send chatroom message");
	},
	'click span.name': function (e) {
		var uname = e.target.attributes.alt.value;
		var input = $('#mrc-input').val();
		$('#mrc-input').val('@' + uname + ' ' + input).focus();
		analytics.track("Clicked name on name area");
	}
});
