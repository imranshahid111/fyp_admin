const baseController = require('./baseController');

const fareController = {
    getAll: baseController.getAll('FareStructure'),
    getOne: baseController.getOne('FareStructure'),
    create: baseController.create('FareStructure'),
    update: baseController.update('FareStructure'),
    remove: baseController.remove('FareStructure'),
};

module.exports = fareController;
