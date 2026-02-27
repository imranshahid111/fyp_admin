const models = require('../models');

const getSettings = async (req, res) => {
    try {
        const settings = await models.Settings.findOne();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        const [settings] = await models.Settings.upsert(req.body);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings,
};
