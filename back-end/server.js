require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

//DB Connection and server

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_CONNECTION)
    .then(() => console.log('DB Connected'))
    .then(() => {
        app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`)
        })
    });

//Middleware

app.use(express.json());

//Routes

const userRoutes = require('./routes/userRoutes');

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello from express');
})

app.get('*', (req, res) => {
    res.status(404).send('Not Found');
})

app.use(errorHandler);

