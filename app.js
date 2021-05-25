const express = require('express')
const app = express()
const PORT = 3003
const middleware = require('./middleware')

const server = app.listen(PORT, () =>
  console.log(`server listening on port ${PORT}`)
)

app.set('view engine', 'pug') //setting the view engine to pug
app.set('views', 'views') //go to folder called views

//Routes
const loginRoute = require('./routes/loginRoutes')

app.use('/login', loginRoute)

app.get('/', middleware.requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: 'Home',
  }
  res.status(200).render('home', payload)
})
