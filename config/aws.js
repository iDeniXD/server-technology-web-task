const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const { 
    AWS_ACCESS_KEY_ID, 
    AWS_SECRET_ACCESS_KEY, 
    AWS_BUCKET_NAME,
    AWS_BUCKET_REGION,
} = process.env;

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_BUCKET_REGION
});

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/zip') {
            return cb(new Error('Only .zip format allowed!'), false);
        }
        cb(null, true);
    }
  })

module.exports = {upload, s3};