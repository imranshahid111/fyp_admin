const baseController = require('./baseController');

const jobController = {
    getAll: baseController.getAll('Job'),
    getOne: baseController.getOne('Job'),
    create: baseController.create('Job'),
    update: baseController.update('Job'),
    remove: baseController.remove('Job'),
};

module.exports = jobController;
