const baseController = require('./baseController');

const notificationController = {
    getAll: baseController.getAll('Notification'),
    getOne: baseController.getOne('Notification'),
    create: baseController.create('Notification'),
    update: baseController.update('Notification'),
    remove: baseController.remove('Notification'),
};

module.exports = notificationController;
