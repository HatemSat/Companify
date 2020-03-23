// Imports et initialisations
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./config/config')
const passport = require('passport');
const jwt = require('express-jwt');
const mongoose = require('mongoose');
require('./config/passport');

app.use(passport.initialize());
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.CORS_HOST.toString());
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers",
        'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorisation');
    next();
})


// Express-Jwt verification de l'authenticité du token.
const authCheck = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
})

// Restrictions d'accès admin/membres.
const guard = require('express-jwt-permissions')({
    requestProperty: 'payload',
    permissionsProperty: 'permissions'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


var cachegoose = require('cachegoose');
cachegoose(mongoose, {
    // engine: '',
    port: 6379,
    host: 'localhost'
});



// Mongodb and MockDatabase connections.
if (process.env.NODE_ENV === 'test') {
    const Mockgoose = require('mockgoose').Mockgoose
    const mockgoose = new Mockgoose(mongoose)

    mockgoose.prepareStorage()
        .then(() => {
            mongoose.connect(`mongodb://${process.env.MONGO_U}:${encodeURI(process.env.MONGO_P)}@${config.database.host}:${config.database.port}/${config.database.name}?authSource=${config.database.admin}`, { useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.connection.on('connected', () => {
                console.log('Mock Db connection is now open');
            });
        }).catch(err => console.log(err))
} else {
    mongoose.connect(`mongodb://${process.env.MONGO_U}:${encodeURI(process.env.MONGO_P)}@${config.database.host}:${config.database.port}/${config.database.name}?authSource=${config.database.admin}`, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('connected', () => {
        console.log('Real Db connection is now open');
    });
    mongoose.connection.on('close', () => {
        console.log('Real connection closed');
    })
}


// Stress test endpoint
app.get('/api/stress', (req, res) => {
    res.json({ hello: 'stressor' })
})
app.use('/api/members', authCheck, require('./controllers/members.controller'));
app.use('/api/experts', authCheck, require('./controllers/experts.controller'));
app.use('/api/companies', authCheck, guard.check(['admin']), require('./controllers/companies.controller'));
app.use('/api/admin', authCheck, guard.check(['admin']), require('./controllers/admin.controller'));
app.use('/api/login', require('./controllers/login.controller'));
app.use('/api/contact', require('./controllers/contact.controller'));

// Handle 401, no token provided
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "message": err.name + ": " + err.message });
    }
});

// Handle invalid url
app.use((req, res, next) => {
    res.status(404).end("Sorry API is not here");
});

// Server listening
app.listen(config.server.port, function() {
    console.log(`Server running at http://localhost:${config.server.port}`);
});

// Close Mongoose connection on proces exit
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('App terminating');
        process.exit(0);
    });
});


module.exports = app