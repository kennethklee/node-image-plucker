var fs = require('fs'),
    PNG_HEADER_BUF = new Buffer([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    PNG_HEADER_STRING = PNG_HEADER_BUF.toString('binary'),
    JPEG_HEADER_BUF = new Buffer([0xff, 0xd8]),
    JPEG_HEADER_STRING = JPEG_HEADER_BUF.toString('binary');

module.exports = ImagePlucker;

function ImagePlucker(stream, type, cb) {
    if (!(this instanceof ImagePlucker)) return new ImagePlucker(stream, type, cb);

    var self = this;

    if (type === 'jpeg') {
        this.header = JPEG_HEADER_STRING;
    } else {
        this.header = PNG_HEADER_STRING;
    }

    this.buffer = '';

    stream.on('data', function(data) {
        self.buffer += data.toString('binary');

        self.trimToHeader();

        self.searchForImage(cb);
    });

    stream.on('close', function(code) {
        if (self.buffer) {
            self.trimToHeader();
            var pngFile = new Buffer(self.buffer, 'binary');
            cb(null, pngFile);

            this.buffer = '';
        }
    });
};

ImagePlucker.prototype.trimToHeader = function() {
    var headerPosition = this.buffer.indexOf(this.header);

    if (headerPosition > 0) {
        this.buffer = this.buffer.substr(headerPosition);
    }
};

ImagePlucker.prototype.searchForImage = function(cb) {
    var contentList = this.buffer.split(this.header);

    if (contentList.length > 2) {
        var fileContents = new Buffer(this.header + contentList[1], 'binary');

        cb(null, fileContents);

        this.buffer = this.header + contentList.slice(2).join(this.header);
    }
};
