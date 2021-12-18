var fs = require('fs'),
  request = require('request');

var images = require('./images');

var download = function(uri, filename, callback){
  request.head(uri, function() {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var createFolder = (pathDir) => {
  if (!fs.existsSync(pathDir)){
    fs.mkdirSync(pathDir);
  }
};

var downloadAsync = (uri) => {
  return new Promise(resolve => {
    var splits = uri.split('/');
    var fileName = splits.pop() + '.jpg';
    var path = splits.pop();
    createFolder(path);
    var filePath = path + '/' + fileName;
    console.log(filePath);
    // resolve(filePath);
    download(uri, filePath, () => resolve(fileName));
  })
};

var reqs = images.map(url => (
  downloadAsync(url)
));

Promise.all(reqs).then(() => {
  console.log('DONE');
})
.catch((err) => {
  console.error(err);
});
