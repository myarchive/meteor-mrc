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