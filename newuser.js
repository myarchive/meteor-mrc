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
		if (form.realname)
			Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.name": form.realname}});

		if (form.gender)
			Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.gender": form.gender}});

		if (form.username)
			Meteor.call('setUsername', form.username);

		if (form.password)
			//Accounts.setPassword(Meteor.user()._id, form.password);
			//Meteor.users.update({_id: Meteor.user()._id}, {$set: {"password": form.password}});

			// Always return false, form disappears live once profile is complete
			return false;
	}
});
Template.mrc_newuser.helpers({
	'nameInput': function () {
		if (!Meteor.user().profile || !Meteor.user().profile.name) {
			var html = '<div class="form-group"><label class="col-md-4 control-label" for="realname">Real name</label><div class="col-md-6">';
			html += '<input id="realname" name="realname" type="text" class="form-control input-md" placeholder="John Doe">';
			html += '</div></div>';
			return html;
		}
		return false;
	},
	'gender': function () {
		if (!Meteor.user().profile || !Meteor.user().profile.gender) {
			Meteor.call('setGender');
			var html = '<div class="form-group"><label class="col-md-4 control-label" for="gender">Gender</label><div class="col-md-6">';
			html += '<label class="radio-inline" for="gender-0"><input type="radio" name="gender" id="gender-0" value="male" checked="checked">Male</label>';
			html += '<label class="radio-inline" for="gender-1"><input type="radio" name="gender" id="gender-1" value="female">Female</label>';
			html += '</div></div>';
			return html;
		}
		return false;
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
