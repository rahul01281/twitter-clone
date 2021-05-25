const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../models/UserSchema')
const bcrypt = require('bcrypt')

app.set('view engine', 'pug') //setting the view engine to pug
app.set('views', 'views') //go to folder called

app.use(bodyParser.urlencoded({ extended: false }))

router.get('/', (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/')
  }
  payload = {
    title: 'Register',
  }
  res.status(200).render('register', payload)
})

router.post('/', async (req, res, next) => {
  payload = {
    title: 'Register',
  }

  var firstName = req.body.firstName.trim()
  var lastName = req.body.lastName.trim()
  var username = req.body.username.trim()
  var email = req.body.email.trim()
  var password = req.body.password

  if (firstName && lastName && username && email && password) {
    var user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch((error) => {
      console.log(error)
      payload.errorMessage = 'Something went wrong.'
      res.status(200).render('register', payload)
    })

    if (user === null) {
      //no user found
      var data = req.body

      data.password = await bcrypt.hash(password, 10)

      User.create(data).then((user) => {
        req.session.user = user
        return res.redirect('/')
      })
    } else {
      //user found
      if (email === user.email) {
        payload.errorMessage = 'Email already in use.'
      } else {
        payload.errorMessage = 'Username already in use.'
      }
      res.status(200).render('register', payload)
    }
  } else {
    payload.errorMessage = 'Make sure each field has valid value.'
    res.status(200).render('register', payload)
  }
})

module.exports = router
