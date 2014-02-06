alertTitle = "Contact Search";
alertBtn = "Continue";

//Some HTML constants we'll use
var br = "<br />";
var hr = "<hr />";
var endA = "</a>";

var contactList;

window.onerror = function(msg, url, line) {
  var resStr;
  var idx = url.lastIndexOf('/');
  if (idx > -1) {
    url = url.substring(idx + 1);
  }
  resStr = 'ERROR in ' + url + ' on line ' + line + ': ' + msg;
  console.error(resStr);
  alert(resStr);
  return false;
};

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
  navigator.notification.alert("Cordova is ready", null, "Device Ready", alertBtn);
  console.log("Leaving onDeviceReady");
}

function searchContacts() {
  console.log("Entering searchContacts");
  //Get the search string from the page
  var searchStr = document.getElementById("editSearch").value;
  console.log("Search String: " + searchStr);
  //Figure out which search option is selected
  var searchScope = parseInt($("input:checked").val());
  console.log("Search scope: " + searchScope);
  //Clear out the previous search results
  $('#contacts').html('');
  //Then populate the searchOptions with the list of fields
  //being searched
  var contactFields = [];
  switch(searchScope) {
    case 1:
      //Return name fields only
      contactFields = ['displayName', 'name', 'nickname'];
      break;
    case 2:
      //Return address fields only
      contactFields = ['streetAddress', 'locality', 'region', 'postalCode', 'country'];
      break;
    case 3:
      //Notes field only
      contactFields = ['note'];
      break;
    default:
      //Returns all fields
      contactFields = ['*'];
  }
  //Populate the search options object
  var searchOptions = {
    filter : searchStr,
    multiple : true,
  };
  //Execute the search
  console.log("Contact fields: " + JSON.stringify(contactFields));
  navigator.contacts.find(contactFields, searchSuccess, searchError, searchOptions);
  console.log("Leaving searchContacts");
}

function searchSuccess(contacts) {
  console.log("Entering searchSuccess");
  //Populate the contact list element of the contact list
  //page
  var i, len, theList, theContact;
  //Store the contact data in our global variable so the
  //other functions have something to work with
  contactList = contacts;
  //Did we get any results from the search?
  len = contacts.length;
  if (len > 0) {
    console.log("Processing " + len + " items");
    theList = '';
    for ( i = 0, len; i < len; i += 1) {
      //Get a reference to the current contact
      theContact = contacts[i];
      console.log(JSON.stringify(theContact));
      //on iOS displayName isn't supported, so we can't use it
      if (theContact.displayName == null) {
        theList += "<li><a onclick='showContact(" + i + ");'>" + theContact.name.familyName + ", " + theContact.name.givenName + "</a></li>";
      } else {
        theList += "<li><a onclick='showContact(" + i + ");'>" + theContact.displayName + "</a></li>";
      }
    }
    //Populate the listview
    $('#contacts').html(theList);    
    //Then switch to the Contact Details page
    $.mobile.changePage("#contactList", { transition : "slide"}, false, true);
    //Refrest the ListView contents (can't do this until the page is initialized)
    $('#contacts').listview('refresh');
  } else {
    console.log("No results");
    navigator.notification.alert('Search returned no results', null, alertTitle, alertBtn);
  }
  console.log("Leaving searchSuccess");
}

function searchError(errObj) {
  console.log("Entering searchError");
  var msgText;
  //Now build a message string based upon the error
  //returned by the API
  switch(errObj.code) {
    case ContactError.UNKNOWN_ERROR:
      msgText = "An Unknown Error was reported while saving the contact.";
      break;
    case ContactError.INVALID_ARGUMENT_ERROR:
      msgText = "An invalid argument was used with the Contact API.";
      break;
    case ContactError.TIMEOUT_ERROR:
      msgText = "Timeout Error.";
      break;
    case ContactError.PENDING_OPERATION_ERROR:
      msgText = "Pending Operation Error.";
      break;
    case ContactError.IO_ERROR:
      msgText = "IO Error.";
      break;
    case ContactError.NOT_SUPPORTED_ERROR:
      msgText = "Not Supported Error.";
      break;
    case ContactError.PERMISSION_DENIED_ERROR:
      msgText = "Permission Denied Error.";
      break;
    default:
      msgText = "Unknown Error (" + errObj.code + ")";
      break;
  }
  //Now tell the user what happened
  navigator.notification.alert(msgText, null, "Search Error", alertBtn);
  console.log("Leaving searchError");
}

function showContact(contactIdx) {
  console.log("Entering showContact");
  console.log(contactIdx);  
  var len, i, contact;
  //=======================================================
  //Populate the Contact Details page with information
  //about this contact
  //=======================================================
  //Get the contact record
  contact = contactList[contactIdx];
  console.log(JSON.stringify(contact));
  //Next set the header content for the page to match the
  //contact's full name. Unfortunately iOS doesn't use displayName,
  //so we have to figure out what to use
  if (contact.displayName == null) {
    //Build the name from the available fields
    $('#contactName').text(contact.name.givenName + " " + contact.name.familyName);
  } else {
    //or just use the display name
    $('#contactName').text(contact.displayName);
  }
  //=======================================================
  //Then populate the body of the content area with
  //detailed fields from the data source
  //=======================================================
  var cd;
  cd = '<strong>First Name:</strong> ' + contact.name.givenName + br;
  cd += '<strong>Last Name:</strong> ' + contact.name.familyName + br;

  //Let's do email addresses
  if (contact.emails != null) {
    len = contact.emails.length;
    if (len > 0) {
      for ( i = 0, len; i < len; i += 1) {
        cd += '<strong>Email (' + i + '):</strong> <a href="mailto:' + contact.emails[i].value + '">' + contact.emails[i].value + '</a>' + br;
      }
    }
  } else {
    cd += '<strong>Email :</strong> not available' + br;
  }
  //=======================================================
  //Now phone numbers
  //=======================================================
  if (contact.phoneNumbers != null) {
    len = contact.phoneNumbers.length;
    if (len > 0) {
      for ( i = 0, len; i < len; i += 1) {
        cd += '<strong>' + contact.phoneNumbers[i].type + ':</strong><a href = "tel:' + contact.phoneNumbers[i].value + '" > ' + contact.phoneNumbers[i].value + '</a>' + br;
      }
    }
  } else {
    cd += '<strong>Phone Numbers:</strong> not available' + br;
  }
  //=======================================================
  //Show all the contact objects/properties on the bottom 
  //=======================================================
  cd += hr;
  for (myKey in contact) {
    cd += "<strong>Contact[" + myKey + "]</strong> = " + contact[myKey] + br;
  }
  $('#detailContent').html(cd);
  //Then switch to the Contact Details page
  $.mobile.changePage("#contactDetail", "slide", false, true);
  console.log("Leaving showContact");
}

function uploadContact() {
  //Put code in here you would use to upload the selected
  // contact to a server (or somewhere else)

}