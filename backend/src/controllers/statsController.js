const models = require('../models');

const getStats = async (req, res) => {
    try {
        const totalUsers = await models.User.count();
        const totalTruckOwners = await models.TruckOwner.count();
        const totalDrivers = await models.Driver.count();
        const totalJobs = await models.Job.count();
        const activeJobs = await models.Job.count({ where: { status: ['assigned', 'in-progress'] } });
        const completedJobs = await models.Job.count({ where: { status: 'completed' } });

        const jobs = await models.Job.findAll({ where: { status: 'completed' } });
        const totalRevenue = jobs.reduce((sum, job) => sum + job.fare, 0);

        const pendingPaymentsData = await models.Payment.findAll({ where: { status: 'pending' } });
        const pendingPayments = pendingPaymentsData.reduce((sum, p) => sum + p.amount, 0);

        res.json({
            totalUsers,
            totalTruckOwners,
            totalDrivers,
            totalJobs,
            activeJobs,
            completedJobs,
            totalRevenue,
            pendingPayments,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getStats,
};
