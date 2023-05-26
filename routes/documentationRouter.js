const express = require('express');
const router = express.Router();
const documentationController = require('../controllers/documentationController');
const { documentation_validator } = require('../middleware/validation');
const { verifyAdmin } = require('../middleware/auth')

router.get('/', documentationController.getAllDocumentations);
router.post('/', verifyAdmin, documentation_validator, documentationController.createDocumentation);
router.get('/latest', documentationController.getLatest);
router.get('/:id', documentationController.getDocumentationById);
router.put('/:id', verifyAdmin, documentation_validator, documentationController.updateDocumentation);
router.delete('/:id', verifyAdmin, documentationController.deleteDocumentation);

module.exports = router;