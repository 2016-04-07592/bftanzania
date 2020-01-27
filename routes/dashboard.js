const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var multer = require('multer');
var moment = require('moment');
const path = require('path');
const fs = require('fs')


//Storage Engine -- Disk Storage ---- Multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload 
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000
  }
}).fields([{
    name: 'avatar',
    maxCount: 1
  },
  {
    name: 'resume',
    maxCount: 1
  }
]);


//create connection to database
// const db = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '',
//   database: 'bfatanzania'
// });

const db = mysql.createConnection({
  host: 'wvulqmhjj9tbtc1w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'ybjdlt5cp5rnce4u',
  password: 'fxss570h4bwcmj6y ',
  database: 'rj22wkfvawzki9ya'
});


//connecting to data base
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connceted to data base')
});



router.get('/', function (req, res, next) {

  res.render('dashboard/index', {
    errors: {},
  });

});

router.get('/dashboard', ensureAuthenticated, function (req, res, next) {

  res.render('dashboard/dashboard', {

  });

});



router.get('/dashboard/req_member', ensureAuthenticated, function (req, res, next) {

  db.query("SELECT * FROM requests where type = 'member' ", function (err, result) {
    if (!err) {
      console.log(result)
      res.render('dashboard/request', {
        viewTitle: "Member",
        data: result,
        moment
      })
    }
  })
})

router.get('/dashboard/req_partner', ensureAuthenticated, function (req, res, next) {
  db.query("SELECT * FROM requests where type = 'partner' ", function (err, result) {
    if (!err) {

      res.render('dashboard/request', {
        viewTitle: "Partner",
        data: result,
        moment
      })
    }

  })

})

router.get('/dashboard/req_sponsor', ensureAuthenticated, function (req, res, next) {

  db.query("SELECT * FROM requests where type = 'sponsor' ", function (err, result) {
    if (!err) {
      res.render('dashboard/request', {
        viewTitle: "Sponsor",
        data: result,
        moment
      })
    }

  })


})

router.post('/dashboard/member_req', function (req, res, next) {
  //console.log("member posted")
  var date = Math.round(new Date().getTime() / 1000);
  console.log(req.body)

  var data = [
    "member",
    req.body.name,
    req.body.phone,
    req.body.email,
    req.body.why_join,
    date
  ]
  db.query("INSERT INTO requests(type,name_organization,phone,email,why_join,time) VALUES(?,?,?,?,?,?)", data, function (err, result) {
    if (!err) {
      req.flash('accepted', 'request accepted');
      res.redirect('/');
    }
    console.log(err)
  })


})

router.post('/dashboard/partner_req', function (req, res, next) {
  var date = Math.round(new Date().getTime() / 1000);
  var data = [
    "partner",
    req.body.name,
    req.body.phone,
    req.body.email,
    req.body.location,
    req.body.program,
    date
  ]
  db.query("INSERT INTO requests(type,name_organization,phone,email,location,program,time) VALUES(?,?,?,?,?,?,?)", data, function (err, result) {
    if (!err) {
      req.flash('accepted', 'request accepted');
      res.redirect('/');
    }

  })

})

router.post('/dashboard/sponsor_req', function (req, res, next) {
  var date = Math.round(new Date().getTime() / 1000);
  var data = [
    "sponsor",
    req.body.name,
    req.body.phone,
    req.body.email,
    req.body.location,
    req.body.program,
    date
  ]
  db.query("INSERT INTO requests(type,name_organization,phone,email,location,program,time) VALUES(?,?,?,?,?,?,?)", data, function (err, result) {
    if (!err) {
      req.flash('accepted', 'request accepted');
      res.redirect('/');
    }
  })


})


router.get('/dashboard/add', ensureAuthenticated, function (req, res, next) {

  res.render('dashboard/addexe', {
    success: "",
    viewTitle: "New Executive",
    data: {}
  });

});

router.post('/dashboard/upload', function (req, res, next) {

  upload(req, res, (err) => {

    if (err) {
      console.log(err);
      res.render('dashboard/addexe', {
        msg: err,
        data: {}
      });
    } else {
      // console.log(req.files);
      // console.log(req.body);
      var data = [
        req.body.first_name,
        req.body.middle_name,
        req.body.last_name,
        req.body.title,
        req.body.phone,
        req.body.email,
        req.body.bio,
        req.files.avatar[0].path,
        req.files.resume[0].path
      ]

      console.log(data)
      console.log("IDDDDDDDDDDD", req.body.id)
      if (req.body.id == {}) {
        db.query("INSERT INTO executives(first_name,middle_name,last_name,title,phone,email,bio,photo,resume) VALUES (?,?,?,?,?,?,?,?,?)", data, function (err, result) {
          if (err) {
            imagePath = req.files.avatar[0].path;
            filepath = req.files.resume[0].path;

            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(err)
                return
              }
              console.log('Image file Removed')
            })

            fs.unlink(filepath, (err) => {
              if (err) {
                console.error(err)
                return
              }
              console.log('file Removed')
            })

            var error = err.sqlMessage
            res.render('dashboard/addexe', {
              error,
              success: "",
              viewTitle: "New Executive",
              data: {}
            })
            // console.log(err.code);
          } else {
            var social = req.body.social_media;
            var username = req.body.social_username

            for (var i = 0; i < social.length; i++) {
              db.query("INSERT INTO social(id,social_name,username) VALUES ((SELECT id FROM executives where email = ?),?,?)", [req.body.email, social[i], username[i]], function (err, results) {
                if (err) {
                  console.log(err)
                } else {
                  response = results
                }

              });

              // console.log(result)
              res.render('dashboard/addexe', {
                success: "Succesfuly Uploaded",
                viewTitle: "New Executive",
                data: {}
              })

            }

          }
        })
      } else {

        db.query("select * from executives where id = ?", [req.body.id], function (err, result) {
          if (!err) {

            console.log(result)
            imagePath = result[0].photo;
            filepath = result[0].resume;
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(err)
                return
              }
              console.log('Image file Removed')
            })

            fs.unlink(filepath, (err) => {
              if (err) {
                console.error(err)
                return
              }
              console.log('file Removed')
            })


          }
        })


        var data2 = {
          first_name: req.body.first_name,
          middle_name: req.body.middle_name,
          last_name: req.body.last_name,
          title: req.body.title,
          phone: req.body.phone,
          email: req.body.email,
          bio: req.body.bio,
          photo: req.files.avatar[0].path,
          resume: req.files.resume[0].path,

        }

        db.query(" UPDATE executives SET  ?  WHERE id = ? ", [data2, req.body.id], function (err, result) {

          if (err) {
            imagePath = req.files.avatar[0].path;
            filepath = req.files.resume[0].path;

            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(err)
                return
              }
              console.log('Image file Removed')
            })

            fs.unlink(filepath, (err) => {
              if (err) {
                console.error(err)
                return
              }
              console.log('file Removed')
            })

            console.log(err)
            var error = err.sqlMessage
            res.render('dashboard/addexe', {
              error,
              success: "",
              viewTitle: "New Executive",
              data: {}
            })
            // console.log(err.code);
          } else {
            var social = req.body.social_media;
            var username = req.body.social_username

            for (var i = 0; i < social.length; i++) {
              db.query("UPDATE social SET social_name = ?,username= ? WHERE id = ?", [social[i], username[i], req.body.id], function (err, results) {
                if (err) {
                  console.log(err)
                } else {
                  response = results
                }

              });

              // console.log(result)
              res.render('dashboard/addexe', {
                success: "Succesfuly Updated",
                viewTitle: "New Executive",
                data: {}
              })

            }

          }

        })

      }
    }
  })

})

router.get('/dashboard/edit', ensureAuthenticated, function (req, res, next) {
  console.log(req.user)

  db.query("select * from executives", function (err, result1) {

    db.query("select * from social", function (err, result2) {
      console.log(result1);
      console.log(result2)
      res.render('dashboard/editexe', {
        mimi: "hapa hapa",
        executives: result1,
        social: result2,
      });

    })
  })


});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/',
    failureFlash: true
  })
);

//log out of dashboard
router.get('/logout', function (req, res) {
  console.log("LOOOOOOOOOOOOG OUTTTTTTTTTTTTTTTTTT")
  req.logout();
  res.redirect('/admin/');
})


//Updating Content
router.get('/:id', function (req, res) {

  db.query("select * from executives where id = ?", [req.params.id], function (err, result) {
    if (!err) {

      console.log(result)
      res.render('dashboard/addexe', {
        success: "",
        viewTitle: "Update Executive",
        data: result[0].id
      });
    }
  })
});

//Deleting
router.get('/dashboard/delete/:id', function (req, res) {

  db.query("select * from executives where id = ?", [req.params.id], function (err, result) {
    if (!err) {
      console.log(result)
      imagePath = result[0].photo;
      filepath = result[0].resume;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(err)
          return
        }
        console.log('Image file Removed')
      })

      fs.unlink(filepath, (err) => {
        if (err) {
          console.error(err)
          return
        }
        console.log('file Removed')
      })
      db.query("DELETE FROM executives WHERE id = ?", [req.params.id], function (err, result) {
        if (!err) {
          res.redirect('/admin/dashboard/edit');
        }

      })
    }
  })
});


//Local Strategy for passport authentication
passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log(username)

    db.query("select * from admin where username = ? AND password = ?", [username, password], function (error, result) {
      console.log(result)

      if (!result[0] == []) {
        console.log("result");
        var user = {
          "username": result[0].username,

        }
        return done(null, user);
      } else {
        return done(null, false, {
          message: "Incorrect username or password"
        });
      }
    })

  })
);

//check if authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin/');
}

//user serialization
passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {

  db.query("select * from admin where username = ? ", [username], function (error, result) {
    var user = {
      username: result[0].username,

    }
    done(error, user);
  });

});

module.exports = router;