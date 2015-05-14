Template.mrc_newuser.events({
	'keyup': function () {
		validateForm(false);
	},
	'click #submit': function (event) {
		event.preventDefault();

		// Validate Form
		var valid = validateForm(true);
		if (!valid)
			return false;

		// Update User
		var form = getForm();
		if (form.username)
			Meteor.call('setUsername', form.username);
		
		if (form.realname && form.gender)
			Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.name": form.realname, "profile.gender": form.gender}});
		else if (form.realname)
			Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.name": form.realname}});
		else if (form.gender)
			Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.gender": form.gender}});
		
		return true;
	}
});

function getForm() {
	var form = {};
	$.each($('form').serializeArray(), function () {
		form[this.name] = this.value;
	});
	return form;
}

function validateForm(submit) {
	var form = getForm();

	$('.help-block').remove();
	$('.form-group').removeClass('has-error');
	$('.form-group').removeClass('has-warning');
	$('.form-group').removeClass('has-success');
	var ann = /^[a-z0-9]+$/i;
	var ans = /^[a-z0-9 ]+$/i;
	var err = false;

	// Realname Validation
	if (submit && form.realname && form.realname === "") {
		$('#realname').parent().parent().addClass('has-error');
		$('#realname').after('<span class="help-block">Required</span>');
		err = true;
	}
	else if (form.realname && form.realname !== "" && (form.realname.length < 3 || form.realname.length > 50)) {
		$('#realname').parent().parent().addClass('has-error');
		$('#realname').after('<span class="help-block">Between 3 and 50 characters</span>');
		err = true;
	}
	else if (form.realname && form.realname !== "" && !ans.test(form.realname)) {
		$('#realname').parent().parent().addClass('has-error');
		$('#realname').after('<span class="help-block">Letters, numbers and spaces only</span>');
		err = true;
	}
	else if (form.realname && form.realname !== "") {
		$('#realname').parent().parent().addClass('has-success');
		err = false;
	}

	// Username Validation
	if (submit && form.username === "") {
		$('#username').parent().parent().addClass('has-error');
		$('#username').after('<span class="help-block">Required</span>');
		err = true;
	}
	else if (form.username !== "" && (form.username.length < 3 || form.username.length > 15)) {
		$('#username').parent().parent().addClass('has-error');
		$('#username').after('<span class="help-block">Between 3 and 15 characters</span>');
		err = true;
	}
	else if (form.username !== "" && !ann.test(form.username)) {
		$('#username').parent().parent().addClass('has-error');
		$('#username').after('<span class="help-block">Letters and numbers only</span>');
		err = true;
	}
	else if (form.username !== "" && Meteor.users.find({username: form.username}).count() > 0) {
		$('#username').parent().parent().addClass('has-error');
		$('#username').after('<span class="help-block">Username exists</span>');
		err = true;
	}
	else if (form.username !== "") {
		$('#username').parent().parent().addClass('has-success');
		err = false;
	}

	if (err)
		return false;

	return true;
}
