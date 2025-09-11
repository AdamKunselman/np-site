const path = require('path')
const express = require('express');
const app = express();
const connectDB = require('./db/connect.js');
require ('dotenv').config();
const parkRoutes = require('./routes/parks.js');
const infoRoutes = require('./routes/info.js');
const { StatusCodes } = require('http-status-codes');
const sanitizeIncoming = require('./middleware/sanitize.js');
const helmet = require('helmet');


app.use(express.json());
app.use(sanitizeIncoming);
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],           // stays strict
      "style-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      "img-src": ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
      "connect-src": ["'self'", "https://developer.nps.gov", "https://api.nps.gov"], // if calling NPS API
      "object-src": ["'none'"]
    }
  }
}));

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

app.get('/error', (req,res) => {
  res.status(StatusCodes.ACCEPTED).sendFile(path.join(__dirname, 'public/error.html'));
});

app.use((req,res) => {
  res.status(StatusCodes.NOT_FOUND).sendFile(path.join(__dirname, 'public/notFound.html'));
});

const port = process.env.PORT || 5000;

async function start() {
    await connectDB();
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server listening on port: ${port}`)
    })
}

start();