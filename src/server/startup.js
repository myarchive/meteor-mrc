Meteor.startup(function () {
	// Setup services from settings
	var services = Meteor.settings.services;
	if (services) {
		for (var k in services) {
			var svc = {};
			if (services.hasOwnProperty(k)) {
				svc['service'] = k;
				for (var i in services[k]) {
					if (services[k].hasOwnProperty(i)) {
						svc[i] = services[k][i];
					}
				}
			}
			Accounts.loginServiceConfiguration.remove({service: svc['service']});
			Accounts.loginServiceConfiguration.insert(svc);
		}
	}
	
	// Setup Kadira if specified
	var kadira = Meteor.settings.kadira;
	if (kadira) {
		Kadira.connect(kadira.appId, kadira.secret);
	}
});

Accounts.onCreateUser(function (options, user) {
	if (Meteor.users.find({"roles.server":"owner"}).count() === 0)
		Meteor.setTimeout(function(){checkOwner(user._id)},1000);
	
	if (options.profile)
		user.profile = options.profile;
	
	return user;
});

function checkOwner(id) {
	var user = Meteor.users.findOne(id);
	if (Meteor.settings.owner === user.registered_emails[0].address)
		Roles.addUsersToRoles(id, 'owner', 'server');
}



// analytics.page('page name')
// analytics.track("Bought Ticket", {
//  eventName: "Wine Tasting",
//  couponValue: 50,
//});
