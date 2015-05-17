Meteor.methods({
	claimOwner: function () {
		var user = Meteor.user();
		var ownr = Meteor.users.findOne({"roles.server":"owner"});
		if (ownr)
			throw new Meteor.Error(403, "Site already has an owner");

		Roles.setUserRoles(user._id, 'owner', 'server');
		return true;
	},
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
			var room = Meteor.rooms.findOne({droom: true});
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
	},
	updateRoles: function (targ, role) {
		var self = Meteor.user()._id;
		var opts = ['admin','staff','user'];

		if (opts.indexOf(role) < 0)
			throw new Meteor.Error(403, "Invalid role option");

		if (role === 'admin' && !isOwner(self))
			throw new Meteor.Error(403, "Access denied");
		
		if (role === 'staff' && !hasAdmin(self))
			throw new Meteor.Error(403, "Access denied");
		
		if (role === 'user' && !hasStaff(self))
			throw new Meteor.Error(403, "Access denied");

		if (level(targ) >= level(self))
			throw new Meteor.Error(403, "Access denied*");

		Roles.setUserRoles(targ, role, 'server');
	},
	toggleMute: function (targ) {
		var self = Meteor.user()._id;
		
		if (!hasStaff(self))
			throw new Meteor.Error(403, "Access denied");
		
		if (level(targ) >= level(self))
			throw new Meteor.Error(403, "Access denied*");
		
		var targi = Meteor.users.findOne(targ);
		var toggle = (targi && targi.muted) ? false : true;
		
		Meteor.users.update(targ, {$set: {muted:toggle}});
	},
	ban: function (targ, duration, message) {
		var self = Meteor.user()._id;
		
		if (!hasStaff(self))
			throw new Meteor.Error(403, "Access denied");
		
		if (hasStaff(targ))
			throw new Meteor.Error(403, "Access denied*");
		
		if (isBanned(targ))
			throw new Meteor.Error(403, "User is already banned");
		
		
		var exp = new Date();
		exp.setTime(new Date().getTime() + (duration * 60 * 1000));
		
		Meteor.users.update(targ, {$set: {'banned.expires':exp, 'banned.reason':message, 'by':self}});
	},
	unban: function (targ) {
		var self = Meteor.user()._id;
		
		if (!hasStaff(self))
			throw new Meteor.Error(403, "Access denied");
		
		if (level(targ) >= level(self))
			throw new Meteor.Error(403, "Access denied*");
		
		if (!isBanned(targ))
			throw new Meteor.Error(403, "User is not banned");
		
		Meteor.users.update(targ, {$set: {'banned.expires': new Date(), 'banned.unbanned': self}});
	}
});

this.level = function(id) {
	if (isOwner(id))
		return 4;
	if (isAdmin(id))
		return 3;
	if (isStaff(id))
		return 2;
	if (isUser(id))
		return 1;
	return 0;
};

this.hasAdmin = function(id) {
	return Roles.userIsInRole(id, ['owner','admin'], 'server');
};

this.hasStaff = function(id) {
	return Roles.userIsInRole(id, ['owner','admin','staff'], 'server');
};

this.isOwner = function(id) {
	return Roles.userIsInRole(id, 'owner', 'server');
};

this.isAdmin = function(id) {
	return Roles.userIsInRole(id, 'admin', 'server');
};

this.isStaff = function(id) {
	return Roles.userIsInRole(id, 'staff', 'server');
};

this.isUser = function(id) {
	return Roles.userIsInRole(id, 'user', 'server');
};

this.isGuest = function(id) {
	if (Roles.userIsInRole(id, ['owner','admin','staff','user'], 'server'))
		return false;
	return true
};

this.isMuted = function(id) {
	var user = Meteor.users.findOne(id);
	if (user && !user.muted)
		return false;
	return true;
};

this.isBanned = function(id) {
	var user = Meteor.users.findOne(id);
	if (!user.banned || !user.banned.expires || user.banned.expires < new Date())
		return false;
	return true;
};
