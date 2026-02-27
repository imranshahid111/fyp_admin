const express = require('express');
const router = express.Router();
const { paymentController } = require('../controllers');
const auth = require('../middleware/auth');

router.get('/', auth, paymentController.getAll);
router.get('/:id', auth, paymentController.getOne);
router.post('/', auth, paymentController.create);
router.put('/:id', auth, paymentController.update);
router.delete('/:id', auth, paymentController.remove);

module.exports = router;
