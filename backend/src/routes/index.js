const express = require('express');
const router = express.Router();
const { statsController } = require('../controllers');
const auth = require('../middleware/auth');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const truckOwnerRoutes = require('./truckOwnerRoutes');
const driverRoutes = require('./driverRoutes');
const jobRoutes = require('./jobRoutes');
const fareRoutes = require('./fareRoutes');
const bookingRoutes = require('./bookingRoutes');
const paymentRoutes = require('./paymentRoutes');
const notificationRoutes = require('./notificationRoutes');
const settingsRoutes = require('./settingsRoutes');

// Auth routes
router.use('/auth', authRoutes);

// Dashboard stats
router.get('/stats', auth, statsController.getStats);

// Entity routes
router.use('/users', userRoutes);
router.use('/truckowners', truckOwnerRoutes);
router.use('/drivers', driverRoutes);
router.use('/jobs', jobRoutes);
router.use('/fares', fareRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
