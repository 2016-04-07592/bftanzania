const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var nodemailer = require('nodemailer');



//create connection to database
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'bfatanzania'
});


//connecting to data base
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connceted to data base')
});


router.get('/', function (req, res, next) {

    res.render('index', {

        }

    );

});

router.get('/executives-team', function (req, res, next) {

    db.query("SELECT * FROM executives", function (err, result) {
        if (!err) {
            res.render('ex-team', {
                data: result
            });

        }
    });
});

router.get('/executives-profile/:id', function (req, res, next) {
    console.log(req.params.id)
    db.query("SELECT * FROM executives WHERE id = ?", [req.params.id], function (err, result) {
        if (!err) {
            db.query("select * from social", function (err2, result2) {
                if (!err2) {
                    console.log(result[0].resume)
                    res.render('ex-profile', {
                        data: result,
                        data2: result2
                    });
                }
            })
        }

    })

});

router.get('/programs', function (req, res, next) {

    res.render('programs', {

        }

    );

});

router.get('/about', function (req, res, next) {

    res.render('who-we-are', {

        }

    );

});

router.post('/sendmail', function (req, res) {
    var receiver = req.body.email_recipient
    var name = req.body.name
    var message = `<h2>BFATanzania Web Enquiry Service</h2> <br> <h3> MESSAGE SENDER EMAIL ADDRESS: ${req.body.email_sender} </h3> <br>  <p> MESSAGE: ${req.body.message} </p>`


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    });

    var mailOptions = {
        from: '',
        to: receiver,
        subject: 'Enquiry',
        html: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            req.flash('sent', 'request accepted');
            res.redirect(`/executives-profile/${req.body.id}`);
        }
    });

})

module.exports = router;