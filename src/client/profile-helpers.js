Template.navUser.helpers({
	'username': function () {
		return Meteor.user().profile.name;
	}
});
