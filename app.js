const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const app = express()

// mongodb connection
mongoose.connect('mongodb://localhost:27017/bookworm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

// use sessions for tracking logins
app.use(
  session({
    secret: 'learning soemthing',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db,
    }),
  }),
)

// make user ID available in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId
  next()
})

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

// mount routes
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
