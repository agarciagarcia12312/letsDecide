var moment = require('moment-timezone');

module.exports.timeCheck=(dealStart, dealEnd, daysActive) =>{
  // var gets current day and time info
  var currentTime = moment().tz("America/Denver");
  var hour = parseInt(currentTime.hour());
  var minute = parseInt(currentTime.minute());
  var day = currentTime.day().toString();
  // if statement that fixes time so that it can be read properly
  if (minute<10) {
    minute= "0" + String(minute)
  }
  // deal active says string - turns to array
  var days = daysActive.split(",");
  var timeN = parseInt(String(hour) + String(minute));
  var splitStart = dealStart.split(":");
  var splitEnd =dealEnd.split(":");
  var start = parseInt(splitStart[0] + splitStart[1]);
  var end = parseInt(splitEnd[0] + splitEnd[1]);
  var currentTime = parseInt(hour + minute);
  // console logs to trobleshoot
  console.log("days active start: " + daysActive);
  console.log("current day: " +day);
  console.log("days active: " + days);
  console.log("current hour: " + hour)
  console.log("final startTime: " + start);
  console.log("final end time: " + end);
  console.log("final Time: " + timeN);
  console.log("startTime: "+ dealStart + "dealEnd" + dealEnd);

  // cheks to see if today day is part of available days for deal
  if(days.indexOf(day) > -1) {
    // cheks (time) to see if deal is active
    if ((start < timeN) && (timeN < end)) {
      console.log("deal is active");
      return true;

    } else {
      console.log("deal is inactive")
      return false;
    }
  }
  // if today the deal is not available
  else {
    console.log("not today deal... inactive");
    return false;
  }

}
