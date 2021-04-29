const express = require('express');
const multerS3 = require('multer-s3');
var multer = require('multer');
const aws = require('aws-sdk');
const port = process.env.PORT || 3000;

var s3 = new aws.S3({
  accessKeyId: 'AKIAYGM6GOCDJC7H2LNL',
  secretAccessKey: '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'
})

const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/'));

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'torneo-bucket-1',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '.' + file.originalname.split('.').pop()); //date + extension
    }
  })
});

app.post('/upload', upload.single('profilePic'), function (req, res, next) {
  console.log('Successfully uploaded file :)');
  res.send('Successfully uploaded file :)')
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});