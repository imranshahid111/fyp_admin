const express = require('express');
const router = express.Router();
const { driverController } = require('../controllers');
const auth = require('../middleware/auth');

router.get('/', auth, driverController.getAll);
router.get('/:id', auth, driverController.getOne);
router.post('/', auth, driverController.create);
router.put('/:id', auth, driverController.update);
router.delete('/:id', auth, driverController.remove);

module.exports = router;
