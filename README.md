node-image-plucker
==================

Plucks images from an image output stream. Supports `png` and `jpeg`.

Ideal for ffmpeg image2pipe output.

Inspired from https://github.com/stigdreyer/png-plucker

install
-------

```bash
npm install image-plucker
```

usage
-----
```javascript
var plucker = require('image-plucker'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    counter = 0,
    ffmpeg = spawn('ffmpeg', ['-i', 'rtmp://10.0.0.3:1935/live/cam.stream_360p', '-vcodec', 'png', '-f', 'image2pipe', '-']);

// You can replace 'png' with 'jpeg' for jpeg images.
plucker(ffmpeg.stdout, 'png', function (error, image) {
    counter++
    fs.writeFile('file'+counter+'.png', image);
    console.log('file' + counter + '.png');
});
```
