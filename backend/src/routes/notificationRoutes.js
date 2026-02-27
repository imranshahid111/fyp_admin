const express = require('express');
const router = express.Router();
const { notificationController } = require('../controllers');
const auth = require('../middleware/auth');

router.get('/', auth, notificationController.getAll);
router.get('/:id', auth, notificationController.getOne);
router.post('/', auth, notificationController.create);
router.put('/:id', auth, notificationController.update);
router.delete('/:id', auth, notificationController.remove);

module.exports = router;
