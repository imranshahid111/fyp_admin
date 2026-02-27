const models = require('../models');

const getAll = (modelName) => async (req, res) => {
    try {
        const data = await models[modelName].findAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOne = (modelName) => async (req, res) => {
    try {
        const data = await models[modelName].findByPk(req.params.id);
        if (!data) return res.status(404).json({ error: 'Not found' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = (modelName) => async (req, res) => {
    try {
        const data = await models[modelName].create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const update = (modelName) => async (req, res) => {
    try {
        const [updated] = await models[modelName].update(req.body, {
            where: { id: req.params.id },
        });
        if (!updated) return res.status(404).json({ error: 'Not found' });
        const data = await models[modelName].findByPk(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const remove = (modelName) => async (req, res) => {
    try {
        const deleted = await models[modelName].destroy({
            where: { id: req.params.id },
        });
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
};
