// Get dependencies
var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./src/server/config');

mongoose.connect(config.database);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'50mb', parameterLimit: 1000000 }));

app.use(express.static(path.join(__dirname, 'dist')));

// Allow cross domain for API.
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept, token');
    res.header('Access-Control-Allow-Credentials', 'true');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(204);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

// Set our api routes
require('./src/server/routes')(app);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
var port = process.env.PORT || '8080';
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
