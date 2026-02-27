const express = require('express');
const router = express.Router();
const { fareController } = require('../controllers');
const auth = require('../middleware/auth');

router.get('/', auth, fareController.getAll);
router.get('/:id', auth, fareController.getOne);
router.post('/', auth, fareController.create);
router.put('/:id', auth, fareController.update);
router.delete('/:id', auth, fareController.remove);

module.exports = router;
