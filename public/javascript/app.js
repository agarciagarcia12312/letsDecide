console.log("app working");

var currentTime = new Date();
console.log(currentTime.getMinutes()) 

// for loop that cheks time and assigns specific class depending on weather or not they are active


for (i=0; i <15; i++) {
	startTime = $("#startTime"+i);
	endTime = $("#endTime"+i);
}
 $(".card-grid").flip();

 function toggleMenuArrow() {
    var arrow = $(this).find('.arrow');

    arrow.toggleClass('open');
}

$('.search-btn').on('click', toggleMenuArrow);