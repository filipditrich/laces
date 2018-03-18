$("input").bind("propertychange change click keyup input paste", function(event){
	if ($(this).val().length !== 0){
		// not empty 
		$(this).addClass('typed');
	} else {
		// empty
		$(this).removeClass('typed');
	}
});
$("select").change(function(){
	if ($(this).val() == ""){
		// def selected
		$(this).removeClass('typed');
	} else {
		// another selected
		$(this).addClass('typed');
	}
});
$("button[type=reset]").click(function(){
	$("select").removeClass('typed');
	$("input").removeClass('typed');
});
$(".close-btn").click(function(){
	$(this).parent().fadeTo( "slow" , 0, function() {
		$(this).remove();
  });
});