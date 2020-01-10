var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require('path');
var app = express();


//middlewares-configuration
app.use(bodyParser.json()); //body parser
app.set('views', __dirname + '/views'); // rendering view
app.set("view engine", "ejs"); // setting view engine
app.use(express.static(path.join(__dirname, 'public'))); //express to use public folder

// routes 
const indexRoute = require('./routes/routes');
const dashboardRoute = require('./routes/dashboard');




//routes_app
app.use('/', indexRoute);
app.use('/admin', dashboardRoute);


const server = process.env.PORT || 4000;
app.listen(server, () => {
    console.log(`Server running ....., On Port ${server}`)
});