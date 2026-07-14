const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Routes
// We will add routes here later
app.get('/', (req, res) => {
    res.send('Museum Booking API is running.');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
