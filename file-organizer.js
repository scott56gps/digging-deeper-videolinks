var fs = require('fs'); // For filestream node
var path = require('path'); // For path node

// Get path-name
var pathname = process.argv[2];

var list = fs.readdirSync(pathname);

var files = list.filter(function (file) {
  //console.log(file);
  return file.match(/^data\w+\.js$/);
});

// Display the number of files
//console.log(files.length);

var objectifiedFiles = files.map(function parseFiles(filename) {
  var fileString = fs.readFileSync(filename, 'utf8')
    .replace('var diggingDeeperVideos =', '')
    .replace(/title:/g, '"title":')
    .replace(/speaker:/g, '"speaker":')
    .replace(/imageURL:/g, '"imageURL":')
    .replace(/frameURL:/g, '"frameURL":')
    .replace(/];/, ']')
    .replace(/\},\n\]/, '}\n]')
    .trim();

  return {
    name: filename,
    value: JSON.parse(fileString)
  };
});



/*console.log(objectifiedFiles[0].value[0].title);
console.log(objectifiedFiles[0].value.length);
console.log(objectifiedFiles[0].value[0].frameURL);
console.log(objectifiedFiles[0].value[0].title);
console.log(objectifiedFiles[0].value[0].speaker);
console.log(objectifiedFiles[0]);*/


// Find the number of non-youtube/kaltura frameURL links and in what files they are found
var videoCounter = 0;
var titleCounter = 0;
var speakerCounter = 0;
var videoFilenames = [];
var filesOut = {};
var speakersOut = {};
var titlesOut = {};
var titleFilenames = [];
var speakerFilenames = [];

for (var i = 0; i < objectifiedFiles.length; i++) {
  for (var j = 0; j < objectifiedFiles[i].value.length; j++) {
    if (!(objectifiedFiles[i].value[j].frameURL.includes('https://cdnapisec.kaltura.com/') || objectifiedFiles[i].value[j].frameURL.includes('https://www.youtube.com/'))) {
      videoCounter++;

      //make it if we need to
      if (!Array.isArray(filesOut[objectifiedFiles[i].name])) {
        filesOut[objectifiedFiles[i].name] = [];
        //console.log(filesOut)
      }

      //add it on the list
      filesOut[objectifiedFiles[i].name].push(objectifiedFiles[i].value[j]);
      //console.log(filesOut);

      /*videoFilenames.push({
        fileName: objectifiedFiles[i].name,
        video: objectifiedFiles[i].value[j]
      });*/
      
      videoFilenames.push(filesOut);

    }

    // Search for dupliate speakers
    if (objectifiedFiles[i].value[j].speaker.includes('</sub><br>')) {
      speakerCounter++;

      //make it if we need to
      if (!Array.isArray(speakersOut[objectifiedFiles[i].name])) {
        speakersOut[objectifiedFiles[i].name] = [];
      }

      //add it on the list
      speakersOut[objectifiedFiles[i].name].push(objectifiedFiles[i].value[j]);

      /*if (!(speakerFilenames.includes(objectifiedFiles[i].name))) {
        speakerFilenames.push(objectifiedFiles[i].name);
      }*/
    }

    // Search for duplicate titles
    if (objectifiedFiles[i].value[j].title.includes('<br>')) {
      titleCounter++;

      //make it if we need to
      if (!Array.isArray(titlesOut[objectifiedFiles[i].name])) {
        titlesOut[objectifiedFiles[i].name] = [];
      }

      //add it on the list
      titlesOut[objectifiedFiles[i].name].push(objectifiedFiles[i].value[j]);

      /*if (!(titleFilenames.includes(objectifiedFiles[i].name))) {
  titleFilenames.push(objectifiedFiles[i].name);
}*/
    }
  }
}

// Display results
console.log('Number of non-youtube/kaltura frameURLS: ' + videoCounter + '\n');
console.log('Filenames of where these occurances occur:');

for (var property in filesOut) {
  console.log(property.toString() + ' occurances: ' + filesOut[property].length);
}

/*for (var i = 0; i < videoFilenames.length; i++) {
  console.log(videoFilenames[i]);
}*/

console.log('\n');

console.log('Number of duplicate titles: ' + titleCounter);

for (var property in titlesOut) {
  console.log(property.toString() + ' occurances: ' + titlesOut[property].length);
}

/*for (var i = 0; i < titleFilenames.length; i++) {
  console.log(titleFilenames[i]);
}*/

console.log('\n');

console.log('Number of duplicate speakers: ' + speakerCounter);

for (var property in speakersOut) {
  console.log(property.toString() + ' occurances: ' + speakersOut[property].length);
}

/*
for (var i = 0; i < speakerFilenames.length; i++) {
  console.log(speakerFilenames[i]);
}
*/
