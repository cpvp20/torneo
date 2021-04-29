const express = require('express');
const multerS3 = require('multer-s3');
var multer = require('multer');
const aws = require('aws-sdk');
const port = 3000;

var s3 = new aws.S3({
  /* ... */ })

const path = require('path');

const app = express();
app.use(express.json());

app.use(express.static(__dirname + '/'));

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'some-bucket',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

app.post('/upload', upload.array('photos', 3), function (req, res, next) {
  res.send('Successfully uploaded ' + req.files.length + ' files!')
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});