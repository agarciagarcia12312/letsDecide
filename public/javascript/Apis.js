console.log("Apis working");


// ==============================faceboob init ====================================
//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '1520008688037320',
//       cookie     : true,
//       xfbml      : true,
//       version    : 'v2.10'
//     });
//     FB.AppEvents.logPageView();   
//   };

//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "//connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));


//   FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
// });
// =================================facebook init end =====================================



// api groupon call

function groupon () {
	var queryUrl = "https://partner-api.groupon.com/deals.json?tsToken=US_AFF_0_201236_212556_0&filters=category:food-and-drink&offset=0&limit=10"
	$.ajax({
		method: "GET",

	})
}