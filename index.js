require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const workers = require('./routes/workers.js');
const projects = require('./routes/projects.js');
const tasks = require('./routes/tasks.js');
const badges = require('./routes/badges.js');
const teams = require('./routes/teams.js');
const clients = require('./routes/clients.js');
const utilities = require('./utilities/utilities.js');

/* documentação swagger */
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json")
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer: true}));


const auth = function(req, res, next) {
    let exceptions = ['/api-docs']; 
    if(exceptions.indexOf(req.url) >= 0) {
        next(); 
    } else {
        utilities.validateToken(req.headers.authorization, (result) => {
            if(result) {
                next(); 
            } else {
                res.status(401).send("Invalid Token"); 
            }
        })
    }
}

app.use(express.json());
app.use(auth); 
app.use('/workers', workers);
app.use('/projects', projects);
app.user('/tasks', tasks);
app.user('/badges', badges);
app.user('/teams', teams);
app.user('/clients', clients);

mongoose.connect('', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected to MongoDB")
});

app.listen(port, function() {
    console.log("App is running on port" + port)
})  