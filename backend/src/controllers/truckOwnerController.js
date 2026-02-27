const baseController = require('./baseController');

const truckOwnerController = {
    getAll: baseController.getAll('TruckOwner'),
    getOne: baseController.getOne('TruckOwner'),
    create: baseController.create('TruckOwner'),
    update: baseController.update('TruckOwner'),
    remove: baseController.remove('TruckOwner'),
};

module.exports = truckOwnerController;
