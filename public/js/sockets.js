$(function(){
	var socket = io();

	socket.emit('login');

	// $("#buttonProfileFollowUser").click(function(){
	// 	var x = $(this).attr('href').split("/");
	// 	var toFollow = x[x.length - 1];
	// 	socket.emit('new notification', {
	// 		toFollow: toFollow,
	// 		when: new Date(),
	// 		text: "started following you."
	// 	});

	// });

	socket.on('notification', function(data){
		var toFollow = data.toFollow;
		var when = data.when;
		socket.emit('new notification', {
			toFollow: toFollow,
			when: when,
			from: data.from,
			fromU: data.fromU,
			fromPic: data.fromPic,
			text: "started following you"
		});
	});

	socket.on('found result', function(result){
		if (result.length !== 0){
			renderResults(result);
		} else {
			var searchVal = $(".ref-search").find("input").val();
			$(".ref-search .topbar-dropdown > ul > li:not(.show-more):not(.nothing-found)").remove();
			$(".ref-search .topbar-dropdown > ul > li:last-of-type").before(nothingFound);
			$(".ref-search .topbar-dropdown > ul > li.nothing-found > span > span").text(searchVal);
		}	
	})

	socket.on('receive notification', function(output){
		addNotif(output.from, output.fromU, output.fromPic, output.text, timeNow(output.when));
	});

});