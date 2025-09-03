const path = require('path')
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/connect.js');
require ('dotenv').config();
const parkRoutes = require('./routes/parks.js');
const {sendParkPage} = require('./controllers/parks.js');
const { StatusCodes } = require('http-status-codes');


app.use(express.json());
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1', parkRoutes);

app.get('/', (req,res) => {
    res.status(StatusCodes.OK).sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/park', (req,res) => {
    res.status(StatusCodes.OK).sendFile(path.join(__dirname, 'public/park.html'));
});
app.get('/list', (req,res) => {
    res.status(StatusCodes.OK).sendFile(path.join(__dirname, 'public/list.html'));
});

const port = process.env.PORT || 5000;

async function start() {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server listening on port: ${port}`)
    })
}

start();