//===============================================
// Example 15.1
// JavaScript source: index.js
//===============================================

var alertTitle = "Notification Demo";
var alertBtn = "Continue";
var confirmMsg = "Are you enjoying Apache Cordova API Cookbook?";

function onBodyLoad() {
  //Let the user know we've launched
  alert("onBodyLoad");
  //Set the Cordova deviceready event listener, so we'll know
  //when Cordova is ready
  document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
  console.log("Entering onDeviceReady");
  //Let the user know that the deviceReady event has fired
  navigator.notification.alert("Cordova is ready", null, alertTitle, alertBtn);
  console.log("Leaving onDeviceReady");
}

/************************************************************/

function doJSAlert() {
  console.log("Entering doJSAlert");
  msgText = $('#msgText').val();
  // msgText = document.getElementById('msgText').value;
  alert(msgText);
  console.log("Leaving doJSAlert");
}

function doCVAAlert1() {
  //Reglar old everyday call to alert
  console.log("Entering doCVAAlert1");
  msgText = $('#msgText').val();
  navigator.notification.alert(msgText, alertSuccess, "Sample Alert", "Click Me!");
  console.log("Leaving doCVAAlert1");
}

function alertSuccess() {
  //The alert callback function.
  console.log("Entering alertSuccess");
  navigator.notification.alert("You clicked the button, thanks.", null, alertTitle, alertBtn);
  console.log("Leaving alertSuccess");
}

function doCVAAlert2() {
  //No success callback
  console.log("Entering doCVAAlert2");
  msgText = $('#msgText').val();
  navigator.notification.alert(msgText, null, "Sample Alert");
  console.log("Leaving doCVAAlert2");
}


/************************************************************/

function doBeep() {
  console.log("Entering doBeep");
  beepCount = $('#beepSlider').val();
  // beepCount = document.getElementById('beepSlider').value;
  navigator.notification.beep(beepCount);
  console.log("Leaving doBeep");
}

/************************************************************/

function doConfirm1() {
  console.log("Entering doConfirm");
  navigator.notification.confirm(confirmMsg, confirmSuccess1);
  console.log("Leaving doConfirm");
}

function doConfirm2() {
  console.log("Entering doConfirm");
  navigator.notification.confirm(confirmMsg, confirmSuccess1, "Simple Confirmation 2");
  console.log("Leaving doConfirm");
}

function confirmSuccess1(btnNum) {
  console.log("Entering confirmSuccess");
  console.log("Button: " + btnNum);
  navigator.notification.alert("You pressed button #" + btnNum, null, "Simple Confirmation", alertBtn);
  console.log("Leaving confirmSuccess");
}

function doConfirm3() {
  console.log("Entering doConfirm");
  navigator.notification.confirm(confirmMsg, confirmSuccess3, "Simple Confirmation 3", "Yes, No, Maybe");
  console.log("Leaving doConfirm");
}

function confirmSuccess3(btnNum) {
  console.log("Entering confirmSuccess");
  console.log("Button: " + btnNum);
  var msg;
  switch (parseInt(btnNum)) {
    case 1:
      msg = "Thanks for saying yes!";
      break;
    case 2:
      msg = "Too bad, you said no.";
      break;
    case 3:
      msg = "Really? Maybe? Ouch.";
      break;
  }
  console.log(msg);
  navigator.notification.alert(msg, null, alertTitle, alertBtn);
  console.log("Leaving confirmSuccess");
}

/************************************************************/

function doPrompt1() {
  console.log("Entering doPrompt");
  navigator.notification.prompt("What is your favorite Cordova API?", promptSuccess);
  console.log("Leaving doPrompt");
}

function doPrompt2() {
  console.log("Entering doPrompt");
  navigator.notification.prompt("What is your favorite Cordova API?", promptSuccess, "Simple Prompt 2");
  console.log("Leaving doPrompt");
}

function doPrompt3() {
  console.log("Entering doPrompt");
  navigator.notification.prompt("What is your favorite Cordova API?", promptSuccess, "Simple Prompt 3", ["Yeah Baby", "Nevermind"]);
  console.log("Leaving doPrompt");
}

function doPrompt4() {
  console.log("Entering doPrompt");
  navigator.notification.prompt("What is your favorite Cordova API?", promptSuccess, "Simple Prompt 3", ["Yeah Baby", "Nevermind"], "All of them!");
  console.log("Leaving doPrompt");
}

function promptSuccess(res) {
  console.log("Entering promptSuccess");
  console.log(JSON.stringify(res));
  navigator.notification.alert("You entered '" + res.input1 + "' and tapped button #" + res.buttonIndex, null, alertTitle, alertBtn);
  console.log("Leaving promptSuccess");
}

/************************************************************/

function doVibrate() {
  console.log("Entering doVibe");
  vibeCount = $('#vibeSlider').val();
  // vibeCount = document.getElementById('vibeSlider').value;
  navigator.notification.vibrate(vibeCount);
  console.log("Leaving doVibe");
}
