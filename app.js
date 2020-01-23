var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require('path');
var app = express();
var passport = require("passport");
var session = require("express-session")
var flash = require('connect-flash');


//middlewares-configuration

app.use(bodyParser.json()); //body parser
app.set('views', __dirname + '/views'); // rendering view
app.set("view engine", "ejs"); // setting view engine
app.use(express.static(path.join(__dirname, 'public'))); //express to use public folder

app.use(flash());
app.use(require('cookie-parser')());
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use("*", function (req, res, next) {
    res.locals.user = req.user || null;
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.accepted = req.flash("accepted");
    res.locals.sent = req.flash("sent");

    next();
});

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