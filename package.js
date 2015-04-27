Package.describe({
	name: 'alisalaah:mrc',
	summary: 'Meteor Relay Chat (MRC) is a Meteor chat implementation modeled after IRC',
	version: '0.1.0',
	git: 'https://github.com/alisalaah/meteor-mrc.git'
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@0.9.2');
	api.use('accounts-base', ['client','server']);
	api.use('accounts-password', ['client','server']); // for testing dummy account creation
	api.use('ui', 'client');
	api.use('blaze', 'client');
	api.use('templating', 'client');
	
	api.use('alanning:roles@1.2.12');
	api.use('splendido:accounts-meld@1.3.0');
	api.use('tmeasday:presence@1.0.6');

  	api.use('twbs:bootstrap@3.3.4', 'client');
	api.use('mizzao:bootboxjs@4.4.0', 'client');
	api.use('fortawesome:fontawesome@4.3.0', 'client');
	api.use('iron:router@1.0.7', 'client');
	
    api.add_files("base.css", "client");
    api.add_files("base.html", "client");
    api.add_files("base.js", "client");
	
    api.add_files("admin.html", "client");
    api.add_files("admin.js", "client");
	
    api.add_files("chats.html", "client");
    api.add_files("chats.js", "client");
	
    api.add_files("rooms.html", "client");
    api.add_files("rooms.js", "client");
	
	api.add_files("user.html", "client");
    api.add_files("user.js", "client");
	
    api.add_files("collections.js", "client");

	api.add_files("server-collections.js", "server");
    api.add_files("server-methods.js", "server");
});
