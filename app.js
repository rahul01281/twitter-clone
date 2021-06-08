const express = require('express')
const app = express()
const PORT = 3003
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require('body-parser')
const database = require('./database')
const session = require('express-session')

const server = app.listen(PORT, () =>
  console.log(`server listening on port ${PORT}`)
)

const io = require('socket.io')(server, { pingTimeout: 60000 }) //create an instance of socket.io

app.set('view engine', 'pug') //setting the view engine to pug
app.set('views', 'views') //go to folder called views

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: 'secret', //hash the session
    resave: true,
    saveUninitialized: false,
  })
)

//Routes
const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes')
const logoutRoute = require('./routes/logout')
const postRoutes = require('./routes/postRoutes')
const profileRoutes = require('./routes/profileRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const searchRoutes = require('./routes/searchRoutes')
const messagesRoutes = require('./routes/messagesRoutes')
const notificationsRoutes = require('./routes/notificationRoutes')

//API Routes
const postsApiRoutes = require('./routes/api/posts')
const usersApiRoutes = require('./routes/api/users')
const chatssApiRoutes = require('./routes/api/chats')
const MessagesApiRoutes = require('./routes/api/messages')

app.use('/login', loginRoute)
app.use('/register', registerRoute)
app.use('/logout', logoutRoute)
app.use('/post', middleware.requireLogin, postRoutes)
app.use('/profile', middleware.requireLogin, profileRoutes)
app.use('/uploads', middleware.requireLogin, uploadRoutes)
app.use('/search', middleware.requireLogin, searchRoutes)
app.use('/messages', middleware.requireLogin, messagesRoutes)
app.use('/notifications', middleware.requireLogin, notificationsRoutes)

app.use('/api/posts', postsApiRoutes)
app.use('/api/users', usersApiRoutes)
app.use('/api/chats', chatssApiRoutes)
app.use('/api/messages', MessagesApiRoutes)

app.get('/', middleware.requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  }
  res.status(200).render('home', payload)
})

io.on('connection', (socket) => {
  // will run when something connects to socket io and then socket io will pass this socket
  socket.on('setup', (userData) => {
    socket.join(userData._id) //when we get this setup event, it's going to join this room
    socket.emit('connected')
  })

  socket.on('join room', (room) => {
    socket.join(room)
  })

  //it will then receive it on the server and then inside the room we specified it will emit the typing indication
  socket.on('typing', (room) => {
    socket.in(room).emit('typing')
  })

  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing')
  })

  socket.on('new message', (newMessage) => {
    var chat = newMessage.chat

    if (!chat.users) return console.log('chat.users not defined')

    //loop over every user and ignore if we are the person that sent the message but for everyone else we will send a notification in their own personal room telling them that there's a new message
    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return
      socket.in(user._id).emit('message received', newMessage)
    })
  })
})
