const express = require('express');
const router = express.Router();
const documentationController = require('../controllers/documentationController');
const { documentation_validator } = require('../middleware/validation');
const {verifyHead} = require('../middleware/auth')

router.get('/', documentationController.getAllDocumentations);
router.post('/', verifyHead, documentation_validator, documentationController.createDocumentation);
router.get('/latest', documentationController.getLatest);
router.get('/:id', documentationController.getDocumentationById);
router.put('/:id', verifyHead, documentation_validator, documentationController.updateDocumentation);
router.delete('/:id', verifyHead, documentationController.deleteDocumentation);

module.exports = router;