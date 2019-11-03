const path = require('path')
const express = require('express')

const app = express()

// parse incoming requests
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// serve static files from /public
app.use(express.static(`${__dirname}/public`))

// view engine setup
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views'))

// include routes
const routes = require('./routes/index')

app.use('/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found')
  err.status = 404
  next(err)
})

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {},
  })
})

// listen on port 3000
app.listen(3000, () => {
  console.log('Express app listening on port 3000')
})
