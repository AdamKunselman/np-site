const path = require('path')
const express = require('express');
const app = express();
const connectDB = require('./db/connect.js');
require ('dotenv').config();
const parkRoutes = require('./routes/parks.js');
const infoRoutes = require('./routes/info.js');
const { StatusCodes } = require('http-status-codes');


app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1', parkRoutes);
app.use('/api/v1/info', infoRoutes);

app.get('/', (req,res) => {
    res.status(StatusCodes.OK).sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/park', (req,res) => {
    res.status(StatusCodes.OK).sendFile(path.join(__dirname, 'public/park.html'));
});
app.get('/list', (req,res) => {
    res.status(StatusCodes.OK).sendFile(path.join(__dirname, 'public/list.html'));
});
app.get('/category', (req,res) => {
    res.status(StatusCodes.OK).sendFile(path.join(__dirname, 'public/category.html'));
});

const port = process.env.PORT || 5000;

async function start() {
    await connectDB();
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server listening on port: ${port}`)
    })
}

start();