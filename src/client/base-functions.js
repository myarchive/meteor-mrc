this.isAtBottom = function () {
	var out = document.getElementById("mrc-chatarea");
	if (!out)
		return false;
	var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
	return isScrolledToBottom;
};

this.scrollToBottom = function () {
	var elm = document.getElementById("mrc-chatarea");
	var scr = elm.scrollHeight;
	$('#mrc-chatarea').animate({scrollTop: scr}, 'fast');
};

this.renderEnv = function () {
	var h = $(window).height();
	$('#mrc-chatarea').css('height', h - 90 + 'px').css('top', '50px').css('padding', '0');
	$('#mrc-namearea').css('height', h - 50 + 'px');
};

this.claimOwner = function () {
	Meteor.call('claimOwner');
};

this.capFirst = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

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
	return true;
};

this.isMuted = function(id) {
	var user = Meteor.users.findOne(id);
	if (user.muted === true)
		return true;
	return false;
};

this.isBanned = function(id) {
	var user = Meteor.users.findOne(id);
	if (!user.banned || !user.banned.expires || user.banned.expires < new Date())
		return false;
	return true;
};
