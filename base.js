Template.registerHelper('mrcLoadBase', function() {
	if (Meteor.user()) return "mrc_base";
	else return (Template["my_login"]) ? "my_login" : "cr_login";
});

Template.mrc_base.onRendered(function () {
	scrollToBottom();
	renderEnv();
	$(window).resize(function() {
		renderEnv();
	});
});

Template.mrc_base.helpers({
	'username': function () {
		return Meteor.user().profile.name;
	}
});

Template.mrc_base.helpers({
});

Template.mrc_base.events({
	'click #brand': function () {
		var html = (Template["my_brand"]) ? Blaze.toHTMLWithData(Template.my_brand) : Blaze.toHTMLWithData(Template.mrc_brand);
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
	}

});

function isAtBottom() {
	var out = document.getElementById("mrc-chatarea");
	var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
	return isScrolledToBottom;
}

function scrollToBottom() {
	var elm = document.getElementById("mrc-chatarea");
	var scr = elm.scrollHeight;
	$('#mrc-chatarea').animate({scrollTop:scr}, 'fast');	
}

function renderEnv() {
	var h = $(window).height();
	$('#mrc-chatarea').css('height',h-90+'px').css('top','50px').css('padding','0');
	$('#mrc-namearea').css('height',h-50+'px');
}





// Database way...
this.addMessage = function(name,message) {
	if (isAtBottom()) {
		$("#mrc-chatarea").append('<p class="guest"><span class="name">'+name+'</span> '+message+'</p>');
		scrollToBottom();
	}
	else {
		$("#mrc-chatarea").append('<p class="guest"><span class="name">'+name+'</span> '+message+'</p>');
		// unread count!!!
		// line at last read
		// remove line when at bottom
		// etc...
	}
}
