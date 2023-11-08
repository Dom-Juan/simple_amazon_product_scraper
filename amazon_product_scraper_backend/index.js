// Essentials libraries to make the server work.
const http = require('http');
const express = require('express');
const cors = require("cors");
const app = express();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const scrapeProducts = require('./scraper');
// Essentials libraries to make the server work.

// using said libraries.
app.use(cors({
    origin: 'http://localhost/amazon_product_scraper_frontend/'
}));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Middleware routes;
app.use('/', scrapeProducts);

// Server listening;
server = http.createServer(app).listen(port, console.log(`server runs on port ${port}`));

module.exports = server;