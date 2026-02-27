const express = require('express');
const router = express.Router();
const { bookingController } = require('../controllers');
const auth = require('../middleware/auth');

router.get('/', auth, bookingController.getAll);
router.get('/:id', auth, bookingController.getOne);
router.post('/', auth, bookingController.create);
router.put('/:id', auth, bookingController.update);
router.delete('/:id', auth, bookingController.remove);

module.exports = router;
