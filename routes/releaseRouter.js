const express = require('express');
const router = express.Router();
const releaseController = require('../controllers/releaseController');
const { release_validator } = require('../middleware/validation');
const {verifyHead} = require('../middleware/auth')

router.get('/', releaseController.getAllReleases);
router.post('/', verifyHead, release_validator, releaseController.createRelease);
router.get('/latest', releaseController.getLatest);
router.get('/:id', releaseController.getReleaseById);
router.put('/:id', verifyHead, release_validator, releaseController.updateRelease);
router.delete('/:id', verifyHead, releaseController.deleteRelease);

module.exports = router;