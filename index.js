require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', urlRoutes);

const mongoURI = process.env.MONGO_URI; // MongoDB connection string
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
    