const express = require('express');
const router = express.Router();
const {upload} = require('../config/aws')
const fileController = require('../controllers/fileController');
const {verifyHead} = require('../middleware/auth')

router.post('/', verifyHead, upload.single('file'), fileController.createFile);
router.get('/:key', upload.single('file'), fileController.downloadFile);
router.delete('/:key', verifyHead, fileController.deleteFile);

module.exports = router;