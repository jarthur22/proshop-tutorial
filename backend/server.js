const express = require('express');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));