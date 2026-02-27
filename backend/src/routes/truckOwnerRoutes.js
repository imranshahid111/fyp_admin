const express = require('express');
const router = express.Router();
const { truckOwnerController } = require('../controllers');
const auth = require('../middleware/auth');

router.get('/', auth, truckOwnerController.getAll);
router.get('/:id', auth, truckOwnerController.getOne);
router.post('/', auth, truckOwnerController.create);
router.put('/:id', auth, truckOwnerController.update);
router.delete('/:id', auth, truckOwnerController.remove);

module.exports = router;
