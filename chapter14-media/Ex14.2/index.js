//===============================================
// Example 14.2
// JavaScript source: index.js
//===============================================

//Create the media object that will be the focus of our efforts
//in this application
var theMedia;
//The application sets up a timers so the screen can be regularly
//updated during playback/recording
var playTimer, recTimer;
var isPlaying, isRecording;
var firstRun;

//Some constants that define the media file we'll be working with
var fileName = "/myrecording.";
var androidExt = "amr";
var iOSExt = "wav";

//Some text strings used by the app
var alertTitle = "Media";
var alertBtn = "Continue";
var secondsStr = ' seconds';
var unknownStr = "Unknown";

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

  //Won't be able to determine anything else until the file
  //starts playing
  $('#fileLen').html(unknownStr);
  $('#filePos').html(unknownStr);
  $('#playStat').html(unknownStr);

  //Boolean variable that is used to control initial setup
  //of the page after play begins
  firstRun = true;

  //Get a handle to the temporary file system (allocate 10 Mb for storage)
  window.requestFileSystem(LocalFileSystem.TEMPORARY, (10 * 1024 * 1024), getFileSystemSuccess, onFileError);

  console.log("Leaving onDeviceReady");
}

function getFileSystemSuccess(fs) {
  console.log("Entering getFileSystemSuccess");
  var localFile;
  //Build the local file path the application will use to access the
  localFile = fs.root.fullPath + fileName;
  if (device.platform == "Android") {
    //Build a file path using what you have so far
    localFile += androidExt;
  } else {
    //iOS will search for files, so we can just pass in
    //a file name and it will look in the apps fol
    localFile += iOSExt;
  }
  console.log("Local file: " + localFile);

  //Create the media object we need to do everything we need here
  console.log("Creating media object");
  theMedia = new Media(localFile, mediaSuccess, mediaError, mediaStatus);

  //Write the file name to the page
  $('#fileName').html(localFile);

  console.log("Leaving getFileSystemSuccess");
}

function mediaSuccess() {
  //Executed when the media file is finished playing
  console.log("Entering mediaSuccess");
  //Kill the timer we were using to update the page
  killPlayTimer();
  isPlaying = false;
  //Write the current position to the page
  $('#filePos').html('Finished');
  updatePlayUI();
  //Clear out the progress bar
  // $('#progress-bar').val(0);
  // $('#progress-bar').slider('refresh');
  console.log("Leaving mediaSuccess");
}

function mediaError(errObj) {
  console.error("Entering mediaError");
  console.error(JSON.stringify(errObj));
  //Kill the timer we were using to update the page
  killPlayTimer();
  isPlaying = false;
  //Let the user know what happened
  var errStr;
  //Had to add this because some of the error conditions I encountered
  //did not provide an message value
  if (errObj.message.length > 0) {
    errStr = errObj.message + " (Code: " + errObj.code + ")";
  } else {
    errStr = "Error code: " + errObj.code + " (No error message provided by the Media API)";
  }
  console.error(errStr);
  navigator.notification.alert(errStr, null, "Media Error", alertBtn);
  console.error("Leaving mediaError");
}

function mediaStatus(statusCode) {
  console.log("Entering mediaStatus");
  var theStatus;
  switch (statusCode) {
    case Media.MEDIA_NONE:
      theStatus = "None";
      break;
    case Media.MEDIA_STARTING:
      theStatus = "Starting";
      break;
    case Media.MEDIA_RUNNING:
      theStatus = "Running";
      break;
    case Media.MEDIA_PAUSED:
      theStatus = "Paused";
      break;
    case Media.MEDIA_STOPPED:
      theStatus = "Stopped";
      break;
    default:
      theStatus = "Unknown";
  }
  console.log("Status: " + statusCode + " " + theStatus);

  if (isPlaying) {
    $('#playStat').html(theStatus);
  } else {
    //The status event doesn't seem to fire as often
    //as it does for play
    $('#recordStat').html(theStatus);
  }
  console.log("Leaving mediaStatus");
}

//=========================================================

function doRecordStart() {
  console.log("Entering doRecordStart");
  if (!isPlaying) {
    //Can't record while we're playing
    if (!isRecording) {
      isRecording = true;
      //Start the media file playing
      theMedia.startRecord();
      //Update the page to indicate that we're recording
      $('#recordStat').html("Start Recording");
    } else {
      console.log("Already recording");
      navigator.notification.alert("Media file already being recorded", null, alertTitle, alertBtn);
    }
  } else {
    console.log("Playing");
    navigator.notification.alert("Can't record, we're playing", null, alertTitle, alertBtn);
  }
  console.log("Leaving doRecordStart");
}

function doRecordStop() {
  console.log("Entering doRecordStop");
  if (!isPlaying) {
    //Can't record while we're playing
    if (isRecording) {
      //Then stop playing the audio clip
      theMedia.stopRecord();
      isRecording = false;
      //Update the page to indicate that we're not recording
      $('#recordPos').html("Not Recording");
    } else {
      console.log("Not recording");
      navigator.notification.alert("Can't stop, we're not recording", null, alertTitle, alertBtn);
    }
  } else {
    console.log("Recording");
    navigator.notification.alert("Can't stop recording, we're playing", null, alertTitle, alertBtn);
  }
  console.log("Leaving doRecordStop");
}

//=========================================================

function doPlay() {
  console.log("Entering doPlay");
  if (!isRecording) {
    //Can't play while we're recording
    if (!isPlaying) {
      //Set the flag indicating that we're playing something
      isPlaying = true;
      //Set the flag indicating that we just started playin
      firstRun = true;
      //Start the media file playing      
      theMedia.play();
      //fire off a timer to update the UI every second as it plays
      playTimer = setInterval(updatePlayUI, 1000);
    } else {
      console.log("Already playing");
      navigator.notification.alert("Media file already playing", null, alertTitle, alertBtn);
    }
  } else {
    console.log("Recording");
    navigator.notification.alert("Can't play, we're recording", null, alertTitle, alertBtn);
  }
  console.log("Leaving doPlay");
}

function doPlayStop() {
  console.log("Entering doPlayStop");
  if (!isRecording) {
    //Can't play while we're recording
    if (isPlaying) {
      //Kill the timer we have running
      killPlayTimer();
      //Then stop playing the audio clip
      theMedia.stop();
      isPlaying = false;
      //Write the current position to the page
      $('#filePos').html('Stopped');
    } else {
      console.log("Media object is null");
      navigator.notification.alert("Can't stop, no media file playing", null, alertTitle, alertBtn);
    }
  } else {
    console.log("Recording");
    navigator.notification.alert("Can't stop playback, we're recording", null, alertTitle, alertBtn);
  }
  console.log("Leaving doPlayStop");
}

function killPlayTimer() {
  console.log("Entering killPlayTimer");
  if (playTimer) {
    //Kill the timer that was being used to update the page
    window.clearInterval(playTimer);
    //Set the timer to null, so we can check its status later
    playTimer = null;
  } else {
    console.error('Nothing to do, no timer active');
  }
  console.log("Leaving killPlayTimer");
}

function updatePlayUI() {
  //The timer has fired, so it's time to update the page
  console.log("Entering updatePlayUI");
  //Figure out where we are in the file, result will be available
  //in the callback function, that's where the page gets updated
  theMedia.getCurrentPosition(getPlayPositionSuccess, mediaError);
  console.log("Leaving updatePlayUI");
}

function getPlayPositionSuccess(filePos) {
  console.log("Entering getPositionSuccess");
  console.log("Position: " + filePos);
  var thePos;
  if (filePos > 0) {
    //figure out how long the file is
    var theDur = theMedia.getDuration();
    //Do we know the duration?
    if (theDur > 0) {

      //Round the length to the previous integer
      var theLen = Math.round(theDur);

      //If this is the first time we've updated the UI
      if (firstRun) {
        //No need to do this more than once
        //reset the firstRun value
        firstRun = false;
        //Write the file length to the page
        $('#fileLen').html(theLen + secondsStr);
        //Set the maximum value for the Seek input
        $("#spinInp").attr('max', theLen);
      }

      //Write the current position to the page
      $('#filePos').html(Math.floor(filePos) + secondsStr);

      //Just in case filePos ever goes beyond file length
      //It shouldn't, but who knows...
      if (theLen > filePos) {
        //Calculate the percentage we've completed
        thePos = Math.floor((filePos / theLen) * 100);
      } else {
        //All done, go to 100%
        thePos = 100;
      }
      //Update the progress bar
      console.log('Position: ' + thePos + '%');
      $('#progress-bar').val(thePos);
    } else {
      //otherwise, we don't know how long the file is
      $('#fileLen').html('Unknown');
    }
  } else {
    $('#filePos').html('Stopped');
    $('#progress-bar').val(0);
  }
  $('#progress-bar').slider('refresh');
  console.log("Leaving getPositionSuccess");
}

function onFileError(errObj) {
  console.log("Entering onFileError");
  console.error(JSON.stringify(errObj));
  var msgText = "Unknown error.";
  switch(errObj.code) {
    case FileError.NOT_FOUND_ERR:
      msgText = "File not found error.";
      break;
    case FileError.SECURITY_ERR:
      msgText = "Security error.";
      break;
    case FileError.ABORT_ERR:
      msgText = "Abort error.";
      break;
    case FileError.NOT_READABLE_ERR:
      msgText = "Not readable error.";
      break;
    case FileError.ENCODING_ERR:
      msgText = "Encoding error.";
      break;
    case FileError.NO_MODIFICATION_ALLOWED_ERR:
      msgText = "No modification allowed.";
      break;
    case FileError.INVALID_STATE_ERR:
      msgText = "Invalid state.";
      break;
    case FileError.SYNTAX_ERR:
      msgText = "Syntax error.";
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msgText = "Invalid modification.";
      break;
    case FileError.QUOTA_EXCEEDED_ERR:
      msgText = "Quota exceeded.";
      break;
    case FileError.TYPE_MISMATCH_ERR:
      msgText = "Type mismatch.";
      break;
    case FileError.PATH_EXISTS_ERR:
      msgText = "Path exists error.";
      break;
  }
  //Now tell the user what happened
  console.log(msgText);
  navigator.notification.alert(msgText, null, alertTitle, alertBtn);
  console.log("Leaving onFileError");
}

