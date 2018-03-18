var nothingFound;
var noMessages;
var noNotifications;
jQuery(document).ready(function($) {

	if ($(".ref-notifications .topbar-dropdown > ul").children().length <= 0){
		$(".ref-notifications").removeClass("notif-pres");
	} else {
		$(".ref-notifications").addClass("notif-pres");
		$(".ref-notifications").addClass("shake");
		setTimeout(function(){
			$(".ref-notifications").removeClass("shake");
		}, 850);
	}
	updateNotifications();
	updateMessages();
	nothingFound = $(".ref-search .topbar-dropdown > ul > .nothing-found").detach();
});


function updateNotifications(){	
	var nc = $(".ref-notifications .topbar-dropdown > ul > li[read=false]");

	if ($(".ref-notifications .topbar-dropdown > ul > li:not(.no-notif)").length > 1){
		if ($(".ref-notifications .topbar-dropdown > ul > li.no-notif").length !== 0){
			noNotifications = $(".ref-messages .topbar-dropdown > ul > .no-notif").detach();
		}
	} else {
		$(".ref-notifications .topbar-dropdown > ul > li:last-of-type").before(noNotifications);
	}

	if (nc.length == 0){
		$(".ref-notifications > a > .nc > span").text("");
		$(".ref-notifications").removeClass("notif-pres");
	} else {
		$(".ref-notifications").addClass("notif-pres");
		$(".ref-notifications").addClass("shake");
		setTimeout(function(){
			$(".ref-notifications").removeClass("shake");
		}, 850);
		$(".ref-notifications > a > .nc > span").text(nc.length);
	}

};

function updateMessages(){	
	var mc = $(".ref-messages .topbar-dropdown > ul > li[read=false]");

	if ($(".ref-messages .topbar-dropdown > ul > li:not(.no-notif)").length > 1){
		if ($(".ref-messages .topbar-dropdown > ul > li.no-notif").length !== 0){
			noMessages = $(".ref-messages .topbar-dropdown > ul > .no-notif").detach();
		}
	} else {
		$(".ref-messages .topbar-dropdown > ul > li:last-of-type").before(noMessages);
	}

	if (mc.length == 0){
		$(".ref-messages > a > .nc > span").text("");
		$(".ref-messages").removeClass("notif-pres");
	} else {
		$(".ref-messages").addClass("notif-pres");
		$(".ref-messages").addClass("shake");
		setTimeout(function(){
			$(".ref-messages").removeClass("shake");
		}, 850);
		$(".ref-messages > a > .nc > span").text(mc.length);
	}

};

function addNotif(from, fromU, pic, text, when){
	var notification = '<li read="false"><a href="/user/'+fromU+'"></a><img src="/file/'+pic+'" alt=""><div class="notification-container"><div class="notification"><span><strong>'+from+'</strong> '+text+'<abbr title="timestamp">'+when+'</abbr></span></div></div></li>';

	$(".ref-notifications .topbar-dropdown > ul").prepend(notification);
	updateNotifications();
};

function addMsg(from, fromU, pic, text, when){
	var message = '<li read="false"><a href="/user/'+fromU+'"></a><img src="/file/'+pic+'" alt=""><div class="message-container"><div class="message-container-top"><span>'+from+'</span><abbr title="timestamp">'+when+'</abbr></div><div class="message-container-bottom"><span>'+text+'</span></div></div></li>';

	$(".ref-messages .topbar-dropdown > ul").prepend(message);
	updateMessages();
};

function renderResults(input){
	$(".ref-search .topbar-dropdown > ul > li:not(.not-found):not(.show-more)").remove();
	input.forEach(function(one){
		var name = one.name.full;
		var username = one.username;
		var pic = one.profile.profilePic;
		var flwrs = one.stats.followers.length;
		var ops = 0;
		var result = '<li><a href="/user/'+username+'"></a><img src="/file/'+pic+'" alt="Profile Picture"><div class="pinfo-container"><div class="pinfo-container-top"><span class="name">'+name+'</span><span class="username">'+username+'</span></div><div class="pinfo-container-bottom"><span>followers:<span>'+flwrs+'</span></span><span>ops:<span>'+ops+'</span></span></div></div><div class="followbtn-container"><a href="/user/add/'+username+'">follow</a></div></li>';

		$(".ref-search .topbar-dropdown > ul").prepend(result);
	});
}


function timeNow(time) {
  var d = new Date(time),
      h = (d.getHours()<10?'0':'') + d.getHours(),
      m = (d.getMinutes()<10?'0':'') + d.getMinutes();
  return h + ':' + m;
}

$(document).mouseup(function(e) {
    var refNotifications = $(".ref-notifications");
    var refMessages = $(".ref-messages");
    var refProfile = $(".ref-profile");
    var refSearch = $(".ref-search");

    if (!refNotifications.is(e.target) && refNotifications.has(e.target).length === 0) {
        refNotifications.find(".topbar-dropdown").removeClass("visible");
        refNotifications.removeClass("open");
    }
    if (!refMessages.is(e.target) && refMessages.has(e.target).length === 0){
		refMessages.find(".topbar-dropdown").removeClass("visible");
		refMessages.removeClass("open");
    }
    if (!refProfile.is(e.target) && refProfile.has(e.target).length === 0){
		refProfile.find(".topbar-dropdown").removeClass("visible");
    }
    if (!refSearch.is(e.target) && refSearch.has(e.target).length === 0){
		refSearch.find(".topbar-dropdown").removeClass("visible");
		refSearch.removeClass("bar-present");
		refSearch.find("input").val("").focusout();
    }
});

$(".ref-search > a").click(function(){
	$(this).parent().toggleClass("bar-present");
	$(this).parent().find("input").focus();
});
$('.ref-search').on('input', ':text', function(){
	$(this).parent().find(".topbar-dropdown").addClass("visible");
	var val = $(this).val();
	var maxLength = 18;

	if (val.length === 0){
		$(".ref-search .topbar-dropdown > ul > li:not(.show-more):not(.nothing-found)").remove();
		$(".ref-search .topbar-dropdown").removeClass("visible");
	} else {
		socket.emit('search query', val);
	}
	console.log(val.length);

	if (val.length > maxLength) {
        str = "..." + val.substr(val.length - maxLength,val.length);
    } else {
    	str = val
    }

});
function x(){
	$(".ref-search .topbar-dropdown > ul > li:not(.show-more):not(.nothing-found)").remove();
}
$(".ref-profile > a").click(function(){
	$(this).parent().find(".topbar-dropdown").toggleClass("visible");
});
$(".ref-notifications > a").click(function(){
	// $(".ref-messages .topbar-dropdown").removeClass("visible");
	
	if ($(this).parent().find(".topbar-dropdown > ul > li:not(.no-notif)").length > 1){
		if ($(this).parent().find(".topbar-dropdown > ul > li.no-notif").length !== 0){
			noNotifications = $(".ref-notifications .topbar-dropdown > ul > .no-notif").detach();
		}
	} else {
		$(this).parent().find(".topbar-dropdown > ul > li:last-of-type").before(noNotifications);
	}

	$(this).parent().find(".topbar-dropdown").toggleClass("visible");
	setTimeout(function(){
		$(".ref-notifications .topbar-dropdown > ul > li[read=false]").attr("read", true);
		updateNotifications();
		socket.emit('read notifications');
	}, 1500);
});
$(".ref-messages > a").click(function(){
	// $(".ref-notifications .topbar-dropdown").removeClass("visible");
	
	if ($(this).parent().find(".topbar-dropdown > ul > li:not(.no-notif)").length > 1){
		if ($(this).parent().find(".topbar-dropdown > ul > li.no-notif").length !== 0){
			noMessages = $(".ref-messages .topbar-dropdown > ul > .no-notif").detach();
		}
	} else {
		$(this).parent().find(".topbar-dropdown > ul > li:last-of-type").before(noMessages);
	}

	$(this).parent().find(".topbar-dropdown").toggleClass("visible");
	setTimeout(function(){
		updateMessages();
	}, 1500);


});
$(".topbar-actions > li:not(.ref-search):not(.ref-profile):not(.heading)").click(function(){
	$(".topbar-actions > li").removeClass('open');
	$(this).addClass('open');
});
$("li:not(.ref-search)").click(function(){
	$(".ref-search").removeClass("bar-present");
});
$(".ref-notifications .topbar-dropdown > ul > li:not(.no-notif):first-of-type").hover(function(){
	var arrow = $(this).parent().parent().find(".arrow");


	if (arrow.hasClass("color")){
		arrow.removeClass("color")
	} else {
		arrow.addClass("color")
	}
});
$(".ref-messages .topbar-dropdown > ul > li:not(.no-notif):first-of-type").hover(function(){
	var arrow = $(this).parent().parent().find(".arrow");


	if (arrow.hasClass("color")){
		arrow.removeClass("color")
	} else {
		arrow.addClass("color")
	}
});
$(".ref-search .topbar-dropdown > ul > li:first-of-type").hover(function(){
	var arrow = $(this).parent().parent().find(".arrow");


	if (arrow.hasClass("color")){
		arrow.removeClass("color")
	} else {
		arrow.addClass("color")
	}
});
$("#profilePic_main").click(function(){
	$("#profilePic_input").click();
});
$('#profilePic_input').change(function() { 
    $('#profilePic_upload').submit(); 
});
$("#coverPhoto_main").click(function(){
	$("#coverPhoto_input").click();
});
$('#coverPhoto_input').change(function() { 
    $('#coverPhoto_upload').submit(); 
});







var socket = io.connect();