const baseController = require('./baseController');

const paymentController = {
    getAll: baseController.getAll('Payment'),
    getOne: baseController.getOne('Payment'),
    create: baseController.create('Payment'),
    update: baseController.update('Payment'),
    remove: baseController.remove('Payment'),
};

module.exports = paymentController;
