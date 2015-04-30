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
	onConnect: function () {
		// If not in any rooms start with default
		// If default is allowed

		// If not in a room join default
		if (!Meteor.rooms.findOne({joined: this.userId})) {
			var room = Meteor.rooms.findOne({droom:true});
			var ppl = (room.joined) ? room.joined : [];
			ppl.push(this.userId);
			Meteor.rooms.update({_id: room._id}, {$set: {joined: ppl}});
		}
		return true;
	},
	joinRoom: function (room_id) {
		check(room, String);
		var room = Meteor.rooms.findOne(room_id);

		if (!room)
			throw new Meteor.Error("noroom", "No room found.");
		// If is allowed -- needs done

		var ppl = (room.joined) ? room.joined : [];
		ppl.push(this.userId);
		Meteor.rooms.update({_id: room._id}, {$set: {joined: ppl}});
		
		return true;
	}
});
