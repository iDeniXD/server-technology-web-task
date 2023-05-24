const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage }  = require('multer-storage-cloudinary');
const multer = require('multer')

const { 
    CLOUDINARY_NAME, 
    CLOUDINARY_API_KEY, 
    CLOUDINARY_API_SECRET, 
    CLOUDINARY_FOLDER_NAME
} = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: CLOUDINARY_FOLDER_NAME,
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});

const upload = multer({ storage: storage})

module.exports = upload;