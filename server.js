const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
require('dotenv/config');


// Middlewares
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({
    extended: false
}));


// Imports routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mentoringRoutes = require('./routes/mentoring.routes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/mentoring', mentoringRoutes);


// Connect DB
mongoose.connect(process.env.DB_CONNECTION_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', () => {
    console.log('Database connect error');
});

db.once('open', () => {
    console.log('Database is connected');
});


// Listen
app.listen(process.env.PORT, () => {
    console.log(`Server running in port ${process.env.PORT}`);
});