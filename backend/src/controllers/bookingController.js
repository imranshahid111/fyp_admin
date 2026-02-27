const baseController = require('./baseController');

const bookingController = {
    getAll: baseController.getAll('Booking'),
    getOne: baseController.getOne('Booking'),
    create: baseController.create('Booking'),
    update: baseController.update('Booking'),
    remove: baseController.remove('Booking'),
};

module.exports = bookingController;
