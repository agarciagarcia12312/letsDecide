// function: shoud take in search pararameters object and return results
'use strict';

const yelp = require('yelp-fusion');
const apiKey = 'mg92czuCwSu6ST-feuxlr_hBiZNGc9CbzOrCaW5m2P9jltBPMG9gN6f1TUxvojLAd-PW-6y3vN0S-SlQgR7Xo--UG8jyqIYPzU-PIhf0hCTNGANL9atarAcTKqLoWnYx';
const client = yelp.client(apiKey);


const apiCall = (searchQuery, callBack)=>{
  client.search(searchQuery).then(response => {
    const businesses = response.jsonBody.businesses;

    callBack(businesses);
  }).catch(e => {
    console.log(e);
  });
}



module.exports.apiCall = apiCall;
