//===============================================
// Example 10.1
// JavaScript source: index.js
//===============================================
//creating a global variable here to use to store the array of
// entries as the application moves from screen to screen. Yes, I
// know it's cheating, but this was the easiest way to do this.
var theEntry;
var theEntries;
var theFileSystem;
//Some HTML tag constants to use to create HTML output
var br = '<br />';
var hr = '<hr />';
var startP = '<p>';
var endP = '</p>';
//Dialog constants
var alertTitle = "File";
var alertBtn = "Continue";

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

function processDir(fileSystemType) {
  console.log("Entering processDir");
  console.log(fileSystemType);
  //Get a handle to the local file system (allocate 5 Mb for storage)
  window.requestFileSystem(fileSystemType, (5 * 1024 * 1024), getFileSystemSuccess, onFileError);
  console.log("Leaving processDir");
}

function getFileSystemSuccess(fs) {
  console.log("Entering getFileSystemSuccess");
  //Save the file system object so we can access it later
  //Yes, I know it's cheating, but it's an easier way to do this
  theFileSystem = fs;
  //Kick off a refresh of the file list
  refreshFileList();
  //Switch the directory entries page as the file list is built
  $.mobile.changePage("#dirList", { transition : "slide"}, false, true);
  console.log("Leaving getFileSystemSuccess");
}

function refreshFileList() {
  console.log("Entering refreshFileList");
  var dr = theFileSystem.root.createReader();
  // Get a list of all the entries in the directory
  dr.readEntries(dirReaderSuccess, onFileError);
  console.log("Leaving refreshFileList");
}

function dirReaderSuccess(dirEntries) {
  console.log("Entering dirReaderSuccess");
  console.log(JSON.stringify(dirEntries));
  var i, fl, len;
  //Whack the previous dir entries
  $('#dirEntryList').empty();
  //Save the entries to the global variable I created.
  theEntries = dirEntries;
  //Do we have any entries to process?
  len = dirEntries.length;
  if (len > 0) {
    //Empty out the file list variable
    fl = '';
    for ( i = 0; i < len; i++) {
      if (dirEntries[i].isDirectory) {
        fl += '<li><a href="#" onclick="processEntry(' + i + ');">Directory: ' + dirEntries[i].name + '</a></li>';
      } else {
        fl += '<li><a href="#" onclick="processEntry(' + i + ');">File: ' + dirEntries[i].name + '</a></li>';
      }
    }
  } else {
    fl = "<li>No entries found</li>";
  }
  //Update the page content with our directory list
  $('#dirEntryList').html(fl);
  $('#dirEntryList').listview('refresh');
  console.log("Leaving dirReaderSuccess");
}

function processEntry(entryIndex) {
  console.log("Entering processEntry");
  console.log("Processing " + entryIndex);
  //Get access to the inidividual file entry
  theEntry = theEntries[entryIndex];
  //FileInfo variable
  var fi = "";
  fi += startP + '<strong>Name</strong>: ' + theEntry.name + endP;
  fi += startP + '<strong>Full Path</strong>: ' + theEntry.fullPath + endP;
  fi += startP + '<strong>URI</strong>: ' + theEntry.toURI() + endP;
  if (theEntry.isFile) {
    fi += startP + 'The entry is a file' + endP;
  } else {
    fi += startP + 'The entry is a directory' + endP;
  }
  //Update the page content with information about the file
  $('#fileInfo').html(fi);
  //Display the directory entries page
  $.mobile.changePage("#fileDetails", { transition : "slide"}, false, true);
  //Now go off and see if you can get meta data about the file
  theEntry.getMetadata(getMetadataSuccess, onFileError);
  console.log("Leaving processEntry");
}

function getMetadataSuccess(metadata) {
  console.log("Entering getMetadataSuccess");
  console.log(JSON.stringify(metadata));
  var md = '';
  for (var aKey in metadata) {
    md += '<b>' + aKey + '</b>: ' + metadata[aKey] + br;
  }
  md += hr;
  //Update the page content with information about the file
  $('#fileMetadata').html(md);
  console.log("Leaving getMetadataSuccess");
}

function writeFile() {
  console.log("Entering writeFile");
  if (theFileSystem) {
    //Get a file name for the file
    var theFileName = createRandomString(8) + '.txt';
    console.log("File name: " + theFileName);
    var theFileOptions = {
      create : true,
      exclusive : false
    };
    console.log("File Options: " + JSON.stringify(theFileOptions));
    console.log("Creating file");
    theFileSystem.root.getFile(theFileName, theFileOptions, getFileSuccess, onFileError);
  } else {
    console.error("File system object null");
  }
  console.log("Leaving writeFile");
}

function createRandomString(numChars) {
  var chars = "abcdefghiklmnopqrstuvwxyz";
  var tmpStr = "";
  for (var i = 0; i < numChars; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    tmpStr += chars.substring(rnum, rnum + 1);
  }
  return tmpStr;
}

function getFileSuccess(theEntry) {
  console.log("Entering getFileSuccess");
  console.log("Full path: " + theEntry.fullPath);
  console.log("Name: " + theEntry.name);
  console.log("isFile: " + theEntry.isFile);
  console.log("isDir: " + theEntry.isDirectory);
  //Let the user know we have created a file
  navigator.notification.alert("File entry created.", null, alertTitle, alertBtn);
  //refresh the file list to display the new file in the list
  refreshFileList();
  //Now create the file writer to write to the file
  console.log("Creating file writer");
  theEntry.createWriter(createWriterSuccess, onFileError);
  console.log("Leaving getFileSuccess");
}

function createWriterSuccess(writer) {
  console.log("Entering createWriterSuccess");
  //Write some writer stuff to the log
  console.log("Ready State: " + writer.readyState);
  console.log("File Name: " + writer.fileName);
  console.log("Length: " + writer.length);
  console.log("Position: " + writer.position);

  writer.onabort = function(e) {
    console.log("Write aborted");
    console.error(JSON.stringify(e));
  };

  writer.onwritestart = function(e) {
    console.log("Write start");
    console.log(JSON.stringify(e));
  };

  writer.onwrite = function(e) {
    console.log("Write completed");
    console.log(JSON.stringify(e));
  };

  writer.onwriteend = function(e) {
    console.log("Write end");
    console.log(JSON.stringify(e));
  };

  writer.onerror = function(e) {
    console.error("Write error");
    console.error(JSON.stringify(e));
  };

  writer.write("This file created Example 10.1 from the Apache Cordova API Cookbook");
  console.log("Leaving createWriterSuccess");
}

function removeFile() {
  console.log("Entering removeFile");
  theEntry.remove(removeFileSuccess, onFileError);
  console.log("Leaving removeFile");
}

function removeFileSuccess(entry) {
  console.log("Entering onRemoveFileSuccess");
  console.log(JSON.stringify(entry));
  //Let the user know the file was removed
  navigator.notification.alert("File entry removed.", null, alertTitle, alertBtn);
  //kick off a refresh of the file list
  refreshFileList();
  //Close the current page since the file no longer exists
  history.back();
  console.log("Leaving onRemoveFileSuccess");
}

function viewFile() {
  console.log("Entering viewFile");
  //Set the file name on the page
  $('#viewFileName').html('<h1>' + theEntry.name + '</h1>');
  //Clear out any previous load messages
   $('#readInfo').html('');
  //Display the directory entries page
  $.mobile.changePage("#viewFile", { transition : "slide"}, false, true);
  theEntry.file(fileReaderSuccess, onFileError);
  console.log("Leaving viewFile");
}

function fileReaderSuccess(file) {
  console.log("Entering onFileReaderSuccess");
  var reader = new FileReader();

  reader.onloadend = function(e) {
    console.log("Entering onloadend");
    console.log(JSON.stringify(e));
    $('#readInfo').append("Load end" + br);
    $('#fileContents').html(e.target.result);
    console.log("Leaving onloadend");
  };

  reader.onloadstart = function(e) {
    console.log("Entering onloadstart");
    console.log(JSON.stringify(e));
    $('#readInfo').append("Load start" + br);
    console.log("Leaving onloadstart");
  };

  reader.onloaderror = function(e) {
    console.log("Entering onloaderror");
    console.log(JSON.stringify(e));
    $('#readInfo').append("Load error: " + e.target.error.code + br);
    console.log("Leaving onloaderror");
  };

  reader.readAsText(file);
  console.log("Leaving onFileReaderSuccess");
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
