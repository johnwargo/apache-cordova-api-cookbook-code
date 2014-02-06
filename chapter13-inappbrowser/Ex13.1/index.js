//===============================================
// Example 13.1
// JavaScript source: index.js
//===============================================

var blankStr = '';
var br = '<br />';

var remoteURL = 'http://www.johnwargo.com';
var localURL = 'help.html';

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
  navigator.notification.alert("Cordova is ready", null, "Device Ready", "Continue");
  console.log("Leaving onDeviceReady");
}

/***********************************************
 * Remote Content
 ***********************************************/

function loadRemote1() {
  console.log('Entering loadRemote1');
  //Clear the eventOutput portion of the page
  $('#eventOutput').html(blankStr);
  //do the InAppBrowser stuff
  var refRemote1 = window.open(remoteURL, '_blank', 'location=yes');
  registerEventListeners(refRemote1);
  console.log("Leaving loadRemote1");
}

function loadRemote2() {
  console.log('Entering loadRemote2');
  //Clear the eventOutput portion of the page
  $('#eventOutput').html(blankStr);
  //do the InAppBrowser stuff
  var refRemote2 = window.open(remoteURL, '_blank', 'location=no');
  registerEventListeners(ref5);
  console.log("Leaving loadRemote2");
}

function loadRemote3() {
  console.log('Entering loadRemote3');
  //Clear the eventOutput portion of the page
  $('#eventOutput').html(blankStr);
  //do the InAppBrowser stuff
  var refRemote3 = window.open(remoteURL, '_self', 'location=yes');
  registerEventListeners(refRemote3);
  console.log("Leaving loadRemote3");
}

function loadRemote4() {
  console.log('Entering loadRemote4');
  //Clear the eventOutput portion of the page
  $('#eventOutput').html(blankStr);
  //do the InAppBrowser stuff
  var refRemote4 = window.open(remoteURL, '_system', 'location=yes');
  registerEventListeners(refRemote4);
  console.log("Leaving loadRemote4");
}

/***********************************************
 * Local Content
 ***********************************************/

function loadLocal1() {
  console.log('Entering loadLocal1');
  //Clear the eventOutput portion of the page
  $('#eventOutput').html(blankStr);
  //do the InAppBrowser stuff
  var refLocal1 = window.open(localURL, '_blank', 'location=yes');
  registerEventListeners(refLocal1);
  console.log("Leaving loadLocal1");
}

function loadLocal2() {
  console.log('Entering loadLocal2');
  //Clear the eventOutput portion of the page
  $('#eventOutput').html(blankStr);
  //do the InAppBrowser stuff
  var refLocal2 = window.open(localURL, '_blank', 'location=no');
  registerEventListeners(refLocal2);
  console.log("Leaving loadLocal2");
}

function loadLocal3() {
  console.log('Entering loadLocal3');
  //Clear the eventOutput portion of the page
  $('#eventOutput').html(blankStr);
  //do the InAppBrowser stuff
  var refLocal3 = window.open(localURL, '_self', 'location=yes');
  registerEventListeners(refLocal3);
  console.log("Leaving loadLocal3");
}

function loadLocal4() {
  console.log('Entering loadLocal4');
  //Clear the eventOutput portion of the page
  $('#eventOutput').html(blankStr);
  //do the InAppBrowser stuff
  var refLocal4 = window.open(localURL, '_system', 'location=yes');
  registerEventListeners(refLocal4);
  console.log("Leaving loadLocal4");
}

/***********************************************
 * Event Listener Functions
 ***********************************************/

function registerEventListeners(theWindow) {
  theWindow.addEventListener('loadstart', onLoadEvent);
  theWindow.addEventListener('loadstop', onLoadEvent);
  theWindow.addEventListener('loaderror', onLoadError);
  theWindow.addEventListener('exit', onExit);
}

function onLoadEvent(res) {
  console.log('Entering loadEvent');
  console.log(JSON.stringify(res));
  console.log('Type: ' + res.type);
  console.log('URL: ' + res.url);
  $('#eventOutput').append(JSON.stringify(res) + br);
}

function onLoadError(errObj) {
  console.log('Entering loadError');
  var errorStr = JSON.stringify(errObj);
  console.error(errorStr);
  console.error('Code: ' + errObj.code);
  console.error('Message: ' + errObj.message);
  //do something based on event.type
  $('#eventOutput').append(errorStr + br);
  navigator.notification.alert(errorStr, null, "IAB Error", "Continue");
}

function onExit(res) {
  console.log('Entering onExit');
  console.log(JSON.stringify(res));
  console.log('Type: ' + res.type);
  $('#eventOutput').append(JSON.stringify(res) + br);
}

/***********************************************
 * Injection Functions
 ***********************************************/

function injectCSS() {
  console.log('Entering insertCSS');
  //Clear the eventOutput portion of the page
  $('#eventOutput').append(blankStr);
  //do the InAppBrowser stuff
  var ref = window.open('help.html', '_blank', 'location=no');
  ref.addEventListener('loadstop', function() {
    ref.insertCSS({
      code : "body {background-color:black; color:white}"
    }, successCallback);
  });
  ref.addEventListener('loadstart', loadStart);
  ref.addEventListener('loaderror', loadError);
  ref.addEventListener('exit', onExit);
  console.log("Leaving injectCSS");
}

function injectScript() {
  console.log('Entering injectScript');
  //Clear the eventOutput portion of the page
  $('#eventOutput').append(blankStr);
  //do the InAppBrowser stuff
  var ref = window.open('help.html', '_blank', 'location=no');
  ref.addEventListener('loadstop', function() {
    ref.executeScript({
      code : "$('#heading').replaceWith('<h2>This is some injected text</h2>');"
    }, successCallback);
  });
  console.log("Leaving injectScript");
}

function successCallback() {
  console.log('Entering successCallback');
  $('#eventOutput').append('Success!' + br);
}

