function createRandomStory(numWords) {
  var tmpStr = "";
  for(var i = 0; i < numWords; i++) {
    tmpStr += createRandomString(Math.floor(Math.random() * 10)) + " ";
  }
  return tmpStr;
}

function createRandomString(numChars) {
  var chars = "abcdefghiklmnopqrstuvwxyz";
  var tmpStr = "";
  for(var i = 0; i < numChars; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    tmpStr += chars.substring(rnum, rnum + 1);
  }
  return tmpStr;
}