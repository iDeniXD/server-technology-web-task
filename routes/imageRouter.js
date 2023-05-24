const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../config/cloudinary')
const { uploadImageError } = require('../middleware/validation')

router.post('/', upload.array('images'), imageController.createImage, uploadImageError);
router.delete('/', imageController.deleteImage, uploadImageError);

module.exports = router;