Router.route('/', function () {}); // blank route to prevent home page spam from IR

Template.registerHelper('mrcLoadBase', function() {
	if (Meteor.user()) {
		if (!Meteor.user().profile || !Meteor.user().profile.user)
			return "mrc_newuser";
		return "mrc_base";
	}
	else return (Template["my_login"]) ? "my_login" : "cr_login";
});

Template.mrc_newuser.events({
	'click #submit' : function(event) {
		event.preventDefault();
		var form={};
		$.each($('form').serializeArray(), function() {
			form[this.name] = this.value;
		});
		$('.help-block').remove();

		var ann = /^[a-z0-9]+$/i;
		var ans = /^[a-z0-9 ]+$/i;		
		var err = false;
		
		if (form.realname && (form.realname.length < 3 || form.realname.length > 50 || !ans.test(form.realname))) {
			$('#realname').parent().parent().addClass('has-error');
			$('#realname').after('<span class="help-block">Between 3 and 50 characters<br>Letters and spaces only</span>');
			err = true;
		}
		
		if (form.username.length < 3 || form.username.length > 15 || !ann.test(form.username)) {
			$('#username').parent().parent().addClass('has-error');
			$('#username').after('<span class="help-block">Between 3 and 15 characters<br>Alphanumberic only</span>');
			err = true;
		}
		
		if (err)
			return false;
		
		if (Meteor.user().profile && Meteor.user().profile.name && Meteor.user().profile.gender) {
			Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.user":form.username}});
			return true;
		}

		if (Meteor.user().profile && Meteor.user().profile.name) {
			Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.user":form.username,"profile.gender":form.gender}});
			return true;
		}

		Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.name":form.realname,"profile.user":form.username,"profile.gender":form.gender}});
		return true;
	}
});
Template.mrc_newuser.helpers({
	'nameInput' : function() {
		if (!Meteor.user().profile || !Meteor.user().profile.name) {
			var html = '<div class="form-group"><label class="col-md-4 control-label" for="realname">Real name</label><div class="col-md-6">';
				html += '<input id="realname" name="realname" type="text" class="form-control input-md" placeholder="John Doe">';
				html += '</div></div>';
			return html;
		}
		return false;
	},
	'gender' : function() {
		/* Need Meteor Method because "services" is not available to client
		if (!Meteor.user().profile.gender && typeof Meteor.user().services != "undefined") {
			console.log('1');
			if (Meteor.user().services.facebook && Meteor.user().services.facebook.gender)
				Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.gender":Meteor.user().services.facebook.gender}});
				return 'Gender';
		} */
		
		// If already gender same as below but hi
		
		var html = '<div class="form-group"><label class="col-md-4 control-label" for="gender">Gender</label><div class="col-md-6">';
			html += '<label class="radio-inline" for="gender-0"><input type="radio" name="gender" id="gender-0" value="male" checked="checked">Male</label>';
			html += '<label class="radio-inline" for="gender-1"><input type="radio" name="gender" id="gender-1" value="female">Female</label>';
			html += '</div></div>';
		return html;
	}
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

// New User Form
this.nuform = function() {
	var rn = $('#realname').val();
	var un = $('#username').val();
	var gn = $('input[type="radio"][name="gender""]:checked').val();
	alert('5');
};

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
};


/*

	(function($) {
		// size = flag size + spacing
		var default_size = {
			w: 20,
			h: 15
		};

		function calcPos(letter, size) {
			return -(letter.toLowerCase().charCodeAt(0) - 97) * size;
		}

		$.fn.setFlagPosition = function(iso, size) {
			size || (size = default_size);

			return $(this).css('background-position',
				[calcPos(iso[1], size.w), 'px ', calcPos(iso[0], size.h), 'px'].join(''));
		};
	})(jQuery);

	$('.country i').setFlagPosition('es');

	.country {
		margin: 10px;
		padding: 4px 6px;
		border: 1px solid #999;
		border-radius: 5px;
		display: inline-block;
		font-family: tahoma;
		font-size: 12px
	}
	.country i {
		background: url(https://dl.dropbox.com/u/3413283/flags.png) no-repeat;
		display: inline-block;
		width: 16px;
		height: 11px;
	}

	<div class="country"><i></i> <b>Spain</b></div>

	http://jsfiddle.net/roberkules/TxAhb/

 */