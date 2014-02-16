//===============================================
// Example 10.3
// JavaScript source: index.js
//===============================================
//File Transfer object
var ft;
//File system object we'll use to access the file system
var theFileSystem;
var localTargetFolder;
var br = '<br />';

//Dialog constants
var alertTitle = "File Transfer";
var alertBtn = "Continue";

//Paths to the upload and download file and server locations
var uploadServer = "http://path_to_server/upload.php";
var uploadFile = "uploadme.txt";
var downloadServer = "http://path_to_server/download-me.png";
var downloadFile = "download-me.png";

function onBodyLoad() {
  //Let the user know we've launched
  alert("onBodyLoad");
  //Set the Cordova deviceready event listener, so we'll know
  //when Cordova is ready
  document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
  writeToOutput("Entering onDeviceReady");

  //Get a handle to the temporary file store used by the app.
  writeToOutput("Requesting file system");
  window.requestFileSystem(LocalFileSystem.TEMPORARY, (5 * 1024 * 1024), getFileSystemSuccess, onFileError);

  //Create a fileTransfer Object we'll use for both uploading and downloading
  writeToOutput("Creating File Transfer Object");
  ft = new FileTransfer();
  //Setup the onProgress event so we can see how things work
  writeToOutput("Creating onprogress event");
  ft.onprogress = function(progressObj) {
    writeToOutput("onProgress fired");
    writeToOutput("Progress object: " + JSON.stringify(progressObj, null, '\t'));
    if (progressObj.lengthComputable) {
      //Shift the decimal place then truncate the progress value
      var progress = Math.floor((progressObj.loaded / progressObj.total) * 100);
      //Write it out to the page
      writeToOutput("### Progress: " + progress + "%");
    }
  };
  writeToOutput("Leaving onDeviceReady");
}

function getFileSystemSuccess(fs) {
  writeToOutput("Entering getFileSystemSuccess");
  //Save the file system object so we can access it later
  theFileSystem = fs;
  //Get a handle to the directory entry
  var directoryEntry = fs.root;
  //Set it as the local target folder
  localTargetFolder = directoryEntry.fullPath;
  writeToOutput('Local target folder: ' + localTargetFolder);
  writeToOutput("Leaving getFileSystemSuccess");
}

function writeToOutput(msg, isError) {
  //Set isError to false if the parameter isn't passed to the function
  isError = typeof isError !== 'undefined' ? isError : false;
  //Write the message to the console
  if (isError) {
    console.error(msg);
    $('#processOutput').append("ERROR: " + msg + br);
  } else {
    console.log(msg);
    $('#processOutput').append(msg + br);
  }
}

function doUpload() {
  $('#processOutput').html('');
  writeToOutput("Entering doUpload");

  //Create the file options that control the creation of the upload file
  var theFileOptions = {
    create : true,
    exclusive : false
  };
  //Ask the file system to create the file
  theFileSystem.root.getFile(uploadFile, theFileOptions, getFileSuccess, onFileError);
  writeToOutput("Leaving doUpload");
}

function getFileSuccess(theEntry) {
  writeToOutput("Entering getFileSuccess");
  //Let the user know we have created a file
  // navigator.notification.alert("File entry created.", null, alertTitle, alertBtn);
  //Now create the file writer to write to the file
  writeToOutput("Creating file writer");
  theEntry.createWriter(createWriterSuccess, onFileError);
  writeToOutput("Leaving getFileSuccess");
}

function createWriterSuccess(writer) {
  writeToOutput("Entering createWriterSuccess");

  writer.onwriteend = function(e) {
    writeToOutput("Write end");

    //Build a fileURI for the local file (source)
    var fileURI = localTargetFolder + '/' + uploadFile;
    writeToOutput("fileURI: " + fileURI);

    //Create an uploadOptions object that describes options for the upload
    var uploadOptions = new FileUploadOptions();
    uploadOptions.fileKey = "file";
    uploadOptions.fileName = uploadFile;
    uploadOptions.mimeType = "text/plain";
    writeToOutput("Upload options: " + JSON.stringify(uploadOptions, null, '\t'));
    //Start the file transfer
    writeToOutput("Starting transfer");
    ft.upload(fileURI, encodeURI(uploadServer), transferSuccess, transferError, uploadOptions, true);
  };

  writer.onerror = function(e) {
    writeToOutput("Write error", true);
    writeToOutput(JSON.stringify(e, null, '\t'), true);
  };

  writer.write("This file created Example 10.3 from the Apache Cordova API Cookbook");
  writeToOutput("Leaving createWriterSuccess");
}

function doDownload() {
  $('#processOutput').html('');
  writeToOutput("Entering doDownload");
  if ((device.platform == "Android") || (device.platform == "iOS")) {
    //Build a fileURI for the local file (target)
    var fileURI = localTargetFolder + '/' + downloadFile;
    writeToOutput("fileURI: " + fileURI);
    //start the file transfer
    ft.download(downloadServer, fileURI, transferSuccess, transferError, true);
  } else {
    writeToOutput("File download not supported", true);
    navigator.notification.alert("File download is not supported on this device", null, alertTitle, alertBtn);
  }
  writeToOutput("Leaving doDownload");
}

function transferSuccess(res) {
  writeToOutput("Entering transferSuccess");
  writeToOutput("Result: " + JSON.stringify(res, null, '\t'));
  navigator.notification.alert("Transfer completed", null, alertTitle, alertBtn);
  writeToOutput("Leaving transferSuccess");
}

function transferError(errObj) {
  writeToOutput("Entering transferError", true);
  writeToOutput(JSON.stringify(errObj, null, '\t'), true);
  writeToOutput("Source: " + errObj.source, true);
  writeToOutput("Target: " + errObj.target, true);
  writeToOutput("Error code: " + errObj.code, true);

  var msgText;
  switch(errObj.code) {
    case FileTransferError.FILE_NOT_FOUND_ERR:
      msgText = "File not found";
      break;
    case FileTransferError.INVALID_URL_ERR:
      msgText = "Invalid URL";
      break;
    case FileTransferError.CONNECTION_ERR:
      msgText = "Connection error";
      break;
    case FileTransferError.ABORT_ERR:
      msgText = "Abort error";
      break;
    default:
      msgText = "Unknown error.";
  }
  //Now tell the user what happened
  writeToOutput(msgText, true);
  navigator.notification.alert(msgText, null, alertTitle, alertBtn);
  writeToOutput("Leaving onFileTransferError", true);
}

function onFileError(errObj) {
  writeToOutput("Entering onFileError", true);
  writeToOutput("Error Object: " + JSON.stringify(errObj, null, '\t'), true);
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
  writeToOutput(msgText, true);
  navigator.notification.alert(msgText, null, alertTitle, alertBtn);
  writeToOutput("Leaving onFileError", true);
}
