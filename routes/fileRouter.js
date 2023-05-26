const express = require('express');
const router = express.Router();
const {upload} = require('../config/aws')
const fileController = require('../controllers/fileController');
const { verifyAdmin } = require('../middleware/auth')

router.post('/',  verifyAdmin , upload.single('file'), fileController.createFile);
router.get('/:key', upload.single('file'), fileController.downloadFile);
router.delete('/:key',  verifyAdmin , fileController.deleteFile);

module.exports = router;