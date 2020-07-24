// all dependencies are called in here

const express = require('express') //
const morgan = require('morgan')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()// adds dot-env to the app
// const message = require('./models/message')
const mongoose = require('mongoose')
const app = express() // creates an express application
const http = require('http').Server(app)
// const io = require('socket.io')(http)

// modules for authentication
const Passport = require('passport')
// const crypto = require('crypto')
const session = require('express-session')
const bodyParser = require('body-parser')
// const errorHandler = require('errorhandler')

// store for session storage
const MongoStore = require('connect-mongo')(session)

// templating engine
const exphbs = require('express-handlebars')
// models and routes
// const user = require('./models/users')
const Routes = require('./routes')
const passport = require('passport')

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collections: 'sessions'
})

// sets the template engine
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('viewengine', 'handlebars')

// app configuration
app.use(morgan('dev')) // sets morgan as the middleware to monitor requests
app.use(bodyParser.json)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore, // selects store for connecting session to mongo
  cookie: {
    maxAge: 1000 * 60 * 60 * 24// equals one day
  }
}))

app.use(express.static(path.join(__dirname, '..', 'client', 'build'))) /* path
  module is used to point to the directory for our client side. */

// sets the required environment variablesdb
const port = process.env.PORT || 8080 // creates a port
const uri = process.env.MONGO_URI

// db configuration
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndexes: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
}

mongoose.connect(uri, options)
  .then(
    () => console.log('DB connected')
  ).catch(error => {
    console.log(error)
  }) // connects mongoose to the uri

const db = mongoose.connection
db.on('error',
  console.error.bind(console, 'connection:error'))
db.once('open', () => {
  console.log(`DB connected on ${27017}`)
})

mongoose.set('debug', true)

app.use('/', Routes)
// error handlers and middleware error handler must come lastn

// requires the config file which holds the callbacks for passport
require('./config/passport')(Passport)

// authentication routing
app.use(passport.initialize())// ensures the user is always logged in
app.use(passport.session())// uses express session and passport serialize and deserialuse

app.use((req, res, next) => {
  console.log(req.session)
  console.log(req.user)
  next()
})
/*
io.on("connection", (socket) => {
  console.log("new user connected");
  //listen on change username
  socket.on("change_username", (data) => {
    socket.username = data.username;
  });
  //listen on new message
  socket.on("new_message", (data) => {
    io.sockets.emit("new_message", {
      message: data.message,
      username: socket.username,
    });
    //listen on typing
    socket.on("typing", (data) => {
      socket.broadcast.emit("typing", {
        username: socket.username,
      });
      //listen on stop typing
      socket.on("stop_typing", (data) => {
        socket.broadcast.emit("stop_typing", { username: socket.username });
      });
    });
  });
});
*/

// this is line is important for local host to work
app.get('/', (req, res) => {
  res.render('home')
})

app.listen(port, () => {
  console.log(`app is listening on ${port}`)
})
