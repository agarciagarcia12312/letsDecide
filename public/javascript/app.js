console.log("app working");

var currentTime = new Date();
console.log(currentTime.getMinutes()) 

// for loop that cheks time and assigns specific class depending on weather or not they are active

 $(".card-grid").flip();

 function toggleMenuArrow() {
    var arrow = $(this).find('.arrow');

    arrow.toggleClass('open');
}

$('.search-btn').on('click', toggleMenuArrow);




// =================== facebook login =================
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1520008688037320',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.10'
    });
    FB.AppEvents.logPageView();   
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

//  call to facebook to get login status
FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});


// ============= user authentication cookie ========================
// $.cookie("userSession", 1);


