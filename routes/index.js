const express = require('express')
const User = require('../models/User')
const mid = require('../middleware/index')

const router = express.Router()

// GET /profile
router.get('/profile', mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId).exec((err, user) => {
    if (err) return next(err)

    return res.render('profile', {
      title: 'Profile',
      name: user.name,
      favorite: user.favoriteBook,
    })
  })
})

// GET /logout
router.get('/logout', (req, res, next) => {
  if (req.session)
    req.session.destroy((err) => {
      if (err) return next(err)
      return res.redirect('/')
    })
})

// GET /login
router.get('/login', mid.loggedOut, (req, res, next) => {
  return res.render('login', { title: 'Log In' })
})

// POST /login
router.post('/login', (req, res, next) => {
  let err

  if (!req.body.email && !req.body.password) {
    err = new Error('Email and password are required')
    err.status = 400
    return next(err)
  }

  User.authenticate(req.body.email, req.body.password, (err, user) => {
    if (err || !user) {
      err = new Error('Wrong email or password')
      err.status = 401
      return next(err)
    }

    req.session.userId = user._id
    console.log(req.session)
    return res.redirect('profile')
  })
})

// GET /register
router.get('/register', mid.loggedOut, (req, res, next) => {
  return res.render('register', { title: 'Sign Up' })
})

// POST /register
router.post('/register', async (req, res, next) => {
  let err

  if (req.body.email && req.body.name && req.body.favoriteBook && req.body.password && req.body.confirmPassword) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.confirmPassword) {
      err = new Error('Passwords do not match')
      err.status = 400
      return next(err)
    }

    const userData = {
      email: req.body.email,
      name: req.body.name,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password,
    }

    // use schema's create method to insert
    try {
      const user = await User.create(userData)

      req.session.userId = user._id
      return res.redirect('/profile')
    } catch (error) {
      return next('Register error:', error)
    }
  }

  err = new Error('All fields required')
  return next(err)
})

// GET /
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' })
})

// GET /about
router.get('/about', (req, res, next) => {
  return res.render('about', { title: 'About' })
})

// GET /contact
router.get('/contact', (req, res, next) => {
  return res.render('contact', { title: 'Contact' })
})

module.exports = router
