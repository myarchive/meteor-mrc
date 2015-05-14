Meteor.startup(function () {
});


// analytics.page('page name')
// analytics.track("Bought Ticket", {
//  eventName: "Wine Tasting",
//  couponValue: 50,
//});

// if(Meteor.isClient && Meteor.settings === undefined) Meteor.settings = {};

/*
 
Accounts.loginServiceConfiguration.remove({
    service: 'google'
});
 
Accounts.loginServiceConfiguration.remove({
    service: 'facebook'
});
 
Accounts.loginServiceConfiguration.remove({
    service: 'twitter'
});
 
Accounts.loginServiceConfiguration.remove({
    service: 'github'
});
 
if (isProdEnv()) {
    Accounts.loginServiceConfiguration.insert({
        service: 'github',
        clientId: '00000',
        secret: '00000'
    });
    Accounts.loginServiceConfiguration.insert({
        service: 'twitter',
        consumerKey: '00000',
        secret: '00000'
    });
    Accounts.loginServiceConfiguration.insert({
        service: 'google',
        appId: '00000',
        secret: '00000'
    });
    Accounts.loginServiceConfiguration.insert({
        service: 'facebook',
        appId: '00000',
        secret: '00000'
    });
} else {
    // dev environment
    Accounts.loginServiceConfiguration.insert({
        service: 'github',
        clientId: '11111',
        secret: '11111'
    });
    Accounts.loginServiceConfiguration.insert({
        service: 'twitter',
        consumerKey: '11111',
        secret: '11111'
    });
    Accounts.loginServiceConfiguration.insert({
        service: 'google',
        clientId: '11111',
        secret: '11111'
    });
    Accounts.loginServiceConfiguration.insert({
        service: 'facebook',
        appId: '11111',
        secret: '11111'
    });
}
 */