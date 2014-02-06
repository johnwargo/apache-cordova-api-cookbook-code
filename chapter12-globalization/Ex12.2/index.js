//===============================================
// Example 12.2
// JavaScript source: index.js
//===============================================

//##############################################################
// Events
//##############################################################

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
  theDate = new Date();
  console.log("Leaving onDeviceReady");
}

//##############################################################
// Currency
//##############################################################

function doGetCurrencyPattern(currency) {
  console.log("Entering doGetCurrencyPattern");
  //Open the results page with a Currency header
  switchPage('Currency: getCurrencyPattern');
  //Write the API call to the page
  writeCode('navigator.globalization.getCurrencyPattern("' + currency + '", successCallback, errorCallback);');
  //call the API
  navigator.globalization.getCurrencyPattern(currency, successCallback, errorCallback);
}

//##############################################################
// Date
//##############################################################

function doIsDayLightSavingsTime() {
  console.log("Entering doIsDayLightSavingsTime");
  //Open the results page with a Date header
  switchPage('Date: isDayLightSavingsTime');
  //Write the API call to the page
  writeCode('navigator.globalization.isDayLightSavingsTime(new Date(), successCallback, errorCallback);');
  //call the API
  navigator.globalization.isDayLightSavingsTime(new Date(), successCallback, errorCallback);
}

function doGetFirstDayOfWeek() {
  console.log("Entering doGetFirstDayOfWeek");
  //Open the results page with a Date header
  switchPage('Date: getFirstDayOfWeek');
  //Write the API call to the page
  writeCode('navigator.globalization.getFirstDayOfWeek(successCallback, errorCallback);');
  //call the API
  navigator.globalization.getFirstDayOfWeek(successCallback, errorCallback);
}

function doGetDateNames(options) {
  console.log("Entering doGetDateNames");
  //Was an options object passed to this function?
  var hasOptions = ( typeof options !== 'undefined' );
  //Open the results page with a Date header
  switchPage('Date: getDateNames');
  if (hasOptions) {
    //Write the API call to the page
    writeCode('navigator.globalization.getDateNames(successCallback, errorCallback, ' + JSON.stringify(options) + ');');
    //call the API
    navigator.globalization.getDateNames(successCallback, errorCallback, options);
  } else {
    //Write the API call to the page
    writeCode('navigator.globalization.getDateNames(successCallback, errorCallback);');
    //call the API
    navigator.globalization.getDateNames(successCallback, errorCallback);
  }
}

function doGetDatePattern(options) {
  console.log("Entering doGetDatePattern");
  //Was an options object passed to this function?
  var hasOptions = ( typeof options !== 'undefined' );
  //Open the results page with a Date header
  switchPage('Date: getDatePattern');
  if (hasOptions) {
    //Write the API call to the page
    writeCode('navigator.globalization.getDatePattern(successCallback, errorCallback, ' + JSON.stringify(options) + ');');
    //call the API
    navigator.globalization.getDatePattern(successCallback, errorCallback, options);
  } else {
    //Write the API call to the page
    writeCode('navigator.globalization.getDatePattern(successCallback, errorCallback);');
    //call the API
    navigator.globalization.getDatePattern(successCallback, errorCallback);
  }
}

function doDateToString(options) {
  console.log("Entering doDateToString");
  //Was an options object passed to this function?
  var hasOptions = ( typeof options !== 'undefined' );
  //Open the results page with a Date header
  switchPage('Date: dateToString');
  if (hasOptions) {
    //Write the API call to the page
    writeCode('navigator.globalization.dateToString(new Date(), successCallback, errorCallback, ' + JSON.stringify(options) + ');');
    //call the API
    navigator.globalization.dateToString(new Date(), successCallback, errorCallback, options);
  } else {
    //Write the API call to the page
    writeCode('navigator.globalization.dateToString(new Date(), onSuccess, onFailure);');
    //call the API
    navigator.globalization.dateToString(new Date(), successCallback, errorCallback);
  }
}

function doStringToDate(options) {
  console.log("Entering doStringToDate");
  //Was an options object passed to this function?
  var hasOptions = ( typeof options !== 'undefined' );
  //Open the results page with a Date header
  switchPage('Date: stringToDate');
  var strDate = '01/05/2014 8:00 AM'
  if (hasOptions) {
    if (options.selector == 'time') {
      strDate = '8:00 AM';
    } else {
      strDate = '01/05/2014';
    }
    //Write the API call to the page
    writeCode('navigator.globalization.stringToDate("' + strDate + '", successCallback, errorCallback, ' + JSON.stringify(options) + ');');
    //call the API
    navigator.globalization.stringToDate(strDate, successCallback, errorCallback, options);
  } else {
    //Write the API call to the page
    writeCode('navigator.globalization.stringToDate("' + strDate + '", successCallback, errorCallback);');
    //call the API
    navigator.globalization.stringToDate(strDate, successCallback, errorCallback);
  }
}

//##############################################################
// Locale
//##############################################################

function doLocaleGetPreferredLanguage() {
  console.log("Entering doLocaleGetPreferredLanguage");
  //Open the results page with a Locale header
  switchPage('Locale: getPreferredLanguage');
  //Write the API call to the page
  writeCode('navigator.globalization.getPreferredLanguage(successCallback, errorCallback);');
  //call the API
  navigator.globalization.getPreferredLanguage(successCallback, errorCallback);
}

function doLocaleGetLocaleName() {
  console.log("Entering doLocaleGetLocaleName");
  //Open the results page with a Locale header
  switchPage('Locale: getLocaleName');
  //Write the API call to the page
  writeCode('navigator.globalization.getLocaleName(successCallback, errorCallback);');
  //call the API
  navigator.globalization.getLocaleName(successCallback, errorCallback);
}

//##############################################################
// Number
//##############################################################

function doNumberToString(options) {
  console.log("Entering doNumberToString");
  //Was an options object passed to this function?
  var hasOptions = ( typeof options !== 'undefined' );
  //Did the app specify a percentage?
  var number = 42;
  //Open the results page with a Number header
  switchPage('Number: numberToString');
  if (hasOptions) {
    if (options.type == 'percent') {
      //Divide our number by 100
      var number = number / 100;
    }
    //Write the API call to the page
    writeCode('navigator.globalization.numberToString(' + number + ', successCallback, errorCallback, ' + JSON.stringify(options) + ');');
    //call the API
    navigator.globalization.numberToString(number, successCallback, errorCallback, options);
  } else {
    //Write the API call to the page
    writeCode('navigator.globalization.numberToString(' + number + ', successCallback, errorCallback);');
    //call the API
    navigator.globalization.numberToString(number, successCallback, errorCallback);
  }
}

function doStringToNumber(options) {
  console.log("Entering doStringToNumber");
  //Was an options object passed to this function?
  var hasOptions = ( typeof options !== 'undefined' );
  var number = '42.23';
  //Open the results page with a Number header
  switchPage('Number: stringToNumber');
  if (hasOptions) {
    if (options.type == 'currency') {
      //You should use getCurrencyPattern to determing the currency prefix to use here
      //I'm cheating by just adding the US $ sign to the string
      number = '$' + number;
    };
    if (options.type == 'percent') {
      //Convert the string to a percentage
      number = '42%';
    };
    //Write the API call to the page
    writeCode('navigator.globalization.stringToNumber("' + number + '", successCallback, errorCallback, ' + JSON.stringify(options) + ');');
    //call the API
    navigator.globalization.stringToNumber(number, successCallback, errorCallback, options);
  } else {
    //Write the API call to the page
    writeCode('navigator.globalization.stringToNumber("' + number + '", successCallback, errorCallback);');
    //call the API
    navigator.globalization.stringToNumber(number, successCallback, errorCallback);
  }
}

function doGetNumberPattern(options) {
  console.log("Entering doGetNumberPattern");
  //Was an options object passed to this function?
  var hasOptions = ( typeof options !== 'undefined' );
  //Open the results page with a Number header
  switchPage('Number: getNumberPattern');
  if (hasOptions) {
    //Write the API call to the page
    writeCode('navigator.globalization.getNumberPattern(successCallback, errorCallback, ' + JSON.stringify(options) + ');');
    //call the API
    navigator.globalization.getNumberPattern(successCallback, errorCallback, options);
  } else {
    //Write the API call to the page
    writeCode('navigator.globalization.getNumberPattern(successCallback, errorCallback);');
    //call the API
    navigator.globalization.getNumberPattern(successCallback, errorCallback);
  }
}

//##############################################################
// Callback Functions
//##############################################################

function successCallback(res) {
  console.log("Entering successCallback");
  //Write the results to the log
  console.log(JSON.stringify(res));
  //Write the results header to the page
  $('#pageContent').append('<p><strong>Results:</strong></p>');
  //Now write the actual results to the page in a formatted manner
  //using JSON.stringify
  $('#pageContent').append('<pre>' + JSON.stringify(res, null, '\t') + '</pre>');
  //Put a horizontal Rule between sections
  $('#pageContent').append('<hr />');
  console.log("Leaving successCallback");
}

function errorCallback(errObj) {
  console.error("Entering errorCallback");
  //Write the results to the log
  console.error(JSON.stringify(errObj));
  //Write the results header to the page
  $('#pageContent').append('<p><strong>Error</strong></p>');
  //Now write the actual results to the page in a formatted manner
  //using JSON.stringify
  $('#pageContent').append('<pre>' + JSON.stringify(errObj, null, '\t') + '</pre>');
  console.error("Leaving errorCallback");
}

//##############################################################
// Page Utility Functions
//##############################################################

function switchPage(pageTitle) {
  console.log("Entering switchPage");
  //Set the title on the results page
  $('#pageTitle').html(pageTitle);
  //Remove any previous content from the page
  $('#pageContent').empty();
  //Switch to the results page
  $.mobile.changePage("#results", {
    transition : "slide"
  }, false, true);
  console.log("Leaving switchPage");
}

function writeCode(theCode) {
  console.log("Entering writeCode");
  console.log(theCode);
  $('#pageContent').append('<p><strong>Executing:</strong></p>');
  $('#pageContent').append('<code>' + theCode + '</code>');
  console.log("Leaving writeCode");
}
