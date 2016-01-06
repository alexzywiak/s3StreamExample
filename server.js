var express = require('express');
var s3 = require('s3');
var config = require('./config');
var app = express();

// Set up s3 credentials
var client = s3.createClient({
  s3Options: {
    accessKeyId: config.key,
    secretAccessKey: config.secret
  }
});

app.use('/', express.static(__dirname));

app.get('/audio', function(req, res) {

  var params = {
    Bucket: config.bucket,
    Key: 'test.mp3'
  };

  var downloadStream = client.downloadStream(params);

  downloadStream.on('error', function() {
    res.status(404).send('Not Found');
  });
  downloadStream.on('httpHeaders', function(statusCode, headers, resp) {
    // Set Headers
    res.set({
      'Content-Type': headers['content-type']
    });
  });

  // Pipe download stream to response
  downloadStream.pipe(res);
});

app.listen(3000, function() {
  console.log('makin music on 3000');
});
