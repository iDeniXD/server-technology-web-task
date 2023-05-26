const express = require('express');
const router = express.Router();
const releaseController = require('../controllers/releaseController');
const { release_validator } = require('../middleware/validation');
const { verifyAdmin } = require('../middleware/auth')

router.get('/', releaseController.getAllReleases);
router.post('/',  verifyAdmin , release_validator, releaseController.createRelease);
router.get('/latest', releaseController.getLatest);
router.get('/:id', releaseController.getReleaseById);
router.put('/:id',  verifyAdmin , release_validator, releaseController.updateRelease);
router.delete('/:id',  verifyAdmin , releaseController.deleteRelease);

module.exports = router;