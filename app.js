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

//API Routes
const postsApiRoutes = require('./routes/api/posts')
const usersApiRoutes = require('./routes/api/users')

app.use('/login', loginRoute)
app.use('/register', registerRoute)
app.use('/logout', logoutRoute)
app.use('/post', middleware.requireLogin, postRoutes)
app.use('/profile', middleware.requireLogin, profileRoutes)
app.use('/uploads', middleware.requireLogin, uploadRoutes)
app.use('/search', middleware.requireLogin, searchRoutes)

app.use('/api/posts', postsApiRoutes)
app.use('/api/users', usersApiRoutes)

app.get('/', middleware.requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  }
  res.status(200).render('home', payload)
})

//edit in app.js in some-branch
