const express = require('express');
const dotenv = require('dotenv');
const multerS3 = require('multer-s3')

const {newsRouters,usersRouters} = require('./routes/indexRoutes');

dotenv.config();

var s3 = new aws.S3({ /* ... */ })


const path = require('path');

const app = express();
const news = require('./news');


app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use(express.static(__dirname +'/dist'));

var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'some-bucket',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })
   
  app.post('/upload', upload.array('photos', 3), function(req, res, next) {
    res.send('Successfully uploaded ' + req.files.length + ' files!')
  })