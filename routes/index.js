const express = require('express')

const router = express.Router()

// GET /register
router.get('/register', (req, res, next) => {
  return res.send('register')
})

// POST /register
router.post('/register', (req, res, next) => {
  return res.send('user made')
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
