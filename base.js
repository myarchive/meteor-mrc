Template.registerHelper('crLoadChatTemplate', function() {
	if (Meteor.user()) return "cr_chat";
	else return "cr_login";
});

Template.cr_chat.onRendered(function () {
	renderEnv();
});

Template.chat_full.helpers({
	sitename: function () {
		return "Sitename";
	}
});

Template.cr_chat.helpers({
	'showChats': function () {
		return Blaze.toHTMLWithData(Template.navChats);
	},
	'showRooms': function () {
		return Blaze.toHTMLWithData(Template.navRooms);
	},
	'showAdmin': function () {
		return Blaze.toHTMLWithData(Template.navAdmin);
	},
	'showRoomName': function () {
		return '<h1><i class="fa fa-slack"></i> Main Room</h1>';
	}
});

Template.cr_chat.events({
	'click #brand': function () {
		bootbox.dialog({
			title: "About",
			message: Blaze.toHTMLWithData(Template.chats),
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

function renderEnv(type) {
	if (type === "chat") {
		$('#cr-chat,#cr-name').removeClass();
		$('#cr-name').hide();
		$('#cr-chat').addClass('col-md-12');
	}
	else {
		$('#cr-chat,#cr-name').removeClass();
		$('#cr-name').show();
		$('#cr-chat').addClass('col-md-10');
		$('#cr-name').addClass('col-md-2');
	}
	scrollToBottom();
};

function isAtBottom() {
	var out = document.getElementById("cr-content");
	var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
	return isScrolledToBottom;
}

function scrollToBottom() {
	var elm = document.getElementById("cr-content");
	var scr = elm.scrollHeight;
	$('#cr-content').animate({scrollTop:scr}, 'fast');	
}

// Database way...
this.addMessage = function(name,message) {
	if (isAtBottom()) {
		$("#cr-content").append('<p class="guest"><span class="name">'+name+'</span> '+message+'</p>');
		scrollToBottom();
	}
	else {
		$("#cr-content").append('<p class="guest"><span class="name">'+name+'</span> '+message+'</p>');
		// unread count!!!
		// line at last read
		// remove line when at bottom
		// etc...
	}
}
