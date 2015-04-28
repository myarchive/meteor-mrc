Meteor.methods({
	setGender: function () {
		var user = Meteor.users.findOne(this.userId);
		
		if (!user.profile || !user.profile.gender) {
			if (user.services.facebook && user.services.facebook.gender) {
				Meteor.users.update(this.userId, {$set: {"profile.gender": user.services.facebook.gender}});
				return true;
			}
			else if (user.services.google && user.services.google.gender) {
				Meteor.users.update(this.userId, {$set: {"profile.gender": user.services.google.gender}});
				return true;
			}
		}
		
		return false;
	},
	setUsername: function (username) {
		check(username, String);

		if (!username)
			throw new Meteor.Error("null", "No username given.");

		if (username.length < 3)
			throw new Meteor.Error("short", "Username too short, minimum 3 characters.");

		if (username.length > 15)
			throw new Meteor.Error("long", "Username too long, maximum 15 characters.");

		if (!/^[a-z0-9]+$/i.test(username))
			throw new Meteor.Error("alphanum", "Username can only contain letters and numbers.");

		if (Meteor.users.findOne({username: username}))
			throw new Meteor.Error("exists", "Username already exists");

		Meteor.users.update({_id: this.userId}, {$set: {"username": username}});
		return true;
	},
	checkUsername: function (username) {
		check(username, String);
		
		if (!this.userId) 
			throw new Meteor.Error(401, 'you must be logged in!');

		if (Meteor.users.findOne({username: username}))
			return false;
		
		else
			return true;
	},
	sendMessage: function (message) {
		check(message, String);		
		if (!this.userId) 
			throw new Meteor.Error(401, 'you must be logged in!');
		
		Meteor.messages.insert({
			date: new Date(),
			sender: this.userId,
			room: Meteor.rooms.findOne({droom:true})._id,
			message: message
		});
		return true;
	}

});

//Meteor.call('setUsername', 'ali', function(error){ console.log(error); });
//Meteor.call('checkUsername', 'ali');
