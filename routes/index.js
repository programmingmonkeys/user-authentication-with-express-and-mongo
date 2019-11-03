const express = require('express')
const User = require('../models/User')

const router = express.Router()

// GET /register
router.get('/register', (req, res, next) => {
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
      await User.create(userData)
      return res.redirect('/profile')
    } catch (error) {
      return next(error)
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
