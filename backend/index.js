const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const routes = require('./src/routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

app.use('/api', routes);

// Sync database and start server
sequelize.sync({ alter: true }) // Use alter in development to update tables
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });
