//modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

//define user models
let UserModel = require('../models/users');
let User = UserModel.User; //alias for user

//define the game model
let game = require('../models/games');

//function to check if user is authenticated
function requireAuth(req, res, next)
{
  //check if the user is Logged index
  if(!req.isAuthenticated())
  {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    games: '',
    displayName: req.user ? req.user.displayName : ''
   });
});

/* GET contact page. */
router.get('/contact', (req, res, next) => {
  res.render('content/contact', {
    title: 'Contact',
    games: '',
    displayName: req.user ? req.user.displayName : ''
   });
});

/* get /login - render the login view */
router.get('/login', (req, res, next) => {
  //check to see if user is already logged in
  if(!req.user) {
    // render the login page
    res.render('auth/login', {
      title: 'Login',
      games: '',
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
  } else {
    return res.redirect('/games'); //redirect to the games list
  }
});

// POST /login - process the login page

router.post('/login', passport.authenticate('local', {
    successRedirect: '/games',
    failureRedirect: '/login',
    failureFlash: true
}));

// GET / register - render the register page
router.get('/register', (req, res, next) => {
    // check if the user is not already logged in
    if(!req.user)
    {
      //render the registration page
      res.render('auth/register', {
        title: 'Register',
      games: '',
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
      })
    }
});

//Post /register - process the register page
router.post('/register', (req, res, next) => {
  User.register(
  new User({
      username: req.body.username,
      //password: req.body.password,
      email: req.body.email,
      displayName: req.body.displayName,
    }),
    req.body.password,
    (err) => {
      if(err)
      {
        console.log('error inserting new user');
        if(err.name == 'UserExistsError')
        {
          req.flash('registerMessage', 'Registration Error: User already exists!');
        }
        return res.render('auth/register', {
          title: 'Register',
          games: '',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
        });

      }
      // if registration is successful
      return passport.authenticate('local')(req, res, ()=> {
        res.redirect('/games');
      });

      });
});

//Get /logout - Logout the user and redirect to the homepage
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/'); //redirect to homepage
});

module.exports = router;
