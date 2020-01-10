const express = require('express');
const router = express.Router();
var mysql = require('mysql');


router.get('/', function (req, res, next) {

    res.render('index', {

        }


    );

});

router.get('/executives-team', function (req, res, next) {

    res.render('ex-team', {

        }


    );

});

router.get('/executives-profile/:id', function (req, res, next) {

    res.render('ex-profile', {

        }


    );


})


module.exports = router;