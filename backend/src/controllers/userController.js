const baseController = require('./baseController');

const userController = {
    getAll: baseController.getAll('User'),
    getOne: baseController.getOne('User'),
    create: baseController.create('User'),
    update: baseController.update('User'),
    remove: baseController.remove('User'),
};

module.exports = userController;
