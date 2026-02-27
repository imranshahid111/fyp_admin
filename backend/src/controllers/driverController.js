const baseController = require('./baseController');

const driverController = {
    getAll: baseController.getAll('Driver'),
    getOne: baseController.getOne('Driver'),
    create: baseController.create('Driver'),
    update: baseController.update('Driver'),
    remove: baseController.remove('Driver'),
};

module.exports = driverController;
