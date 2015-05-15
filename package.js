Package.describe({
	name: 'alisalaah:mrc',
	summary: 'Meteor Relay Chat (MRC) is a Meteor chat implementation modeled after IRC',
	version: '0.2.2',
	git: 'https://github.com/alisalaah/meteor-mrc.git'
});

Package.onUse(function (api) {
	api.versionsFrom('METEOR@0.9.2');
	api.use(['ui', 'blaze', 'templating', 'accounts-base', 'accounts-ui']);

	api.use('splendido:accounts-meld@1.3.0', ['client', 'server']);
	api.use('matb33:collection-hooks@0.7.13', ['client', 'server']);
	api.use('mizzao:user-status@0.6.4', ['client', 'server']);
	api.use('alanning:roles@1.2.12', ['client', 'server']);

	api.use('momentjs:moment@2.10.3', 'client');
	api.use('twbs:bootstrap@3.3.4', 'client');
	api.use('mizzao:bootboxjs@4.4.0', 'client');
	api.use('fortawesome:fontawesome@4.3.0', 'client');
	api.use('ephemer:reactive-datatables@1.0.4', 'client');
	api.use('alisalaah:jquery-contextmenu@1.6.6', 'client');

	api.add_files('src/both/collections.js', ['client', 'server']);

	api.add_files('src/client/admin.html', 'client');
	api.add_files('src/client/admin-events.js', 'client');
	api.add_files('src/client/admin-helpers.js', 'client');
	api.add_files('src/client/base.html', 'client');
	api.add_files('src/client/base-events.js', 'client');
	api.add_files('src/client/base-functions.js', 'client');
	api.add_files('src/client/base-helpers.js', 'client');
	api.add_files('src/client/profile.html', 'client');
	api.add_files('src/client/profile-events.js', 'client');
	api.add_files('src/client/profile-helpers.js', 'client');
	api.add_files('src/client/signup.html', 'client');
	api.add_files('src/client/signup-events.js', 'client');
	api.add_files('src/client/signup-helpers.js', 'client');
	api.add_files('src/client/styles.css', 'client');

	api.add_files('src/server/collections.js', 'server');
	api.add_files('src/server/methods.js', 'server');
	api.add_files('src/server/startup.js', 'server');
});
