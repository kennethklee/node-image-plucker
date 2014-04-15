var plucker = require('../'),
    path = require('path'),
    assert = require('assert'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
    imageFiles = [
        path.join(__dirname, 'garbage.txt'),
        path.join(__dirname, '1.png'),
        path.join(__dirname, '2.png'),
        path.join(__dirname, '3.png')
    ];

describe('png-plucker', function() {
    it('correctly splits out several png files from a stream', function(done) {
        var timesCalled = 0,
            testFileStream = spawn('cat', imageFiles);

        plucker(testFileStream.stdout, 'png', function(err, data) {
            assert.ifError(err);

            var filePath = imageFiles[++timesCalled],
                expectedPng = fs.readFileSync(filePath);

            assert.equal(expectedPng.length, data.length); // File size
            assert.equal(expectedPng.toString('binary'), data.toString('binary'), 'Image contents mismatched ' + filePath);

            if (timesCalled === 3) {
                done();
            }
        });
    });
});
