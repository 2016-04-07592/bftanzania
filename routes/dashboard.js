const express = require('express');
const router = express.Router();
var mysql = require('mysql');



router.get('/', function (req, res, next) {

    res.render('dashboard/index', {

    });

});

router.get('/dashboard', function (req, res, next) {

    res.render('dashboard/dashboard', {

    });

});

router.get('/dashboard/add', function (req, res, next) {

    res.render('dashboard/addexe', {

    });

});

router.get('/dashboard/edit', function (req, res, next) {

    res.render('dashboard/editexe', {

    });

});


module.exports = router;