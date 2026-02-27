const express = require('express');
const router = express.Router();
const { jobController } = require('../controllers');
const auth = require('../middleware/auth');

router.get('/', auth, jobController.getAll);
router.get('/:id', auth, jobController.getOne);
router.post('/', auth, jobController.create);
router.put('/:id', auth, jobController.update);
router.delete('/:id', auth, jobController.remove);

module.exports = router;
