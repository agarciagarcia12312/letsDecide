// function: shoud take in search pararameters object and return results
'use strict'
 
const yelp = require('yelp-fusion');

const apiCall = function(searchQuery, callBack){
	console.log(searchQuery);
	
	const clientId ="Bc_bnoDsBRpqiMnDgV5ZHg";
	const clientSecret = "DyinsiGY2ZbAA2Y3GeGQfZP4nKh41hwtPvUUB0Y7c9IpMrrcJWs6bTNhQtWrfkGZ";

	var searchResults = searchQuery;
	// const searchRequest = {
 // 	// term:'Four Barrel Coffee',
 // 	location: 'denver, co',
 // 	limit: 2,
 // 	price: "1,2"
	// };


	yelp.accessToken(clientId, clientSecret).then(response => {

		const client = yelp.client(response.jsonBody.access_token);

		client.search(searchQuery).then(response => {
			// for loop that console.logs the first 10 responces
			// find another way of doing this ---- send back the whole responce instead
			// it'll be better for giving back results
			// for (var i=0; i < response.jsonBody.businesses.length; i++) {
				// console.log(response.jsonBody.businesses);
		    	// const firstResult = response.jsonBody.businesses[0];
		    	callBack(response.jsonBody.businesses);
		    	// const prettyJson = JSON.stringify(firstResult, null, 5);
		    	// console.log(prettyJson);
		    	// searchResults.push({prettyJson})
		    // };	
		    // console.log("all results: " + searchResults[1]);
	  	});
	  	
	}).catch(e => {
  		console.log(e);
	});
};
apiCall();
 
module.exports.apiCall = apiCall;




