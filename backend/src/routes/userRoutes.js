const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const auth = require('../middleware/auth');

router.get('/', auth, userController.getAll);
router.get('/:id', auth, userController.getOne);
router.post('/', auth, userController.create);
router.put('/:id', auth, userController.update);
router.delete('/:id', auth, userController.remove);

module.exports = router;
