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