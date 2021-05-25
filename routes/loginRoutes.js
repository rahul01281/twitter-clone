const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../models/UserSchema')
const bcrypt = require('bcrypt')

app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'pug') //setting the view engine to pug
app.set('views', 'views') //go to folder called views

router.get('/', (req, res, next) => {
  payload = {
    title: 'Login',
  }
  res.status(200).render('login', payload)
})

router.post('/', async (req, res, next) => {
  payload = {
    title: 'Login',
  }

  if (req.body.logUsername && req.body.logPassword) {
    var user = await User.findOne({
      $or: [
        { username: req.body.logUsername },
        { email: req.body.logUsername },
      ],
    }).catch((error) => {
      console.log(error)
      payload.errorMessage = 'Something went wrong.'
      res.status(200).render('login', payload)
    })

    if (user !== null) {
      var result = await bcrypt.compare(req.body.logPassword, user.password)

      if (result) {
        req.session.user = user
        return res.redirect('/')
      }
    }

    payload.errorMessage = 'Login credentials incorrect.'
    return res.status(200).render('login', payload)
  }
  payload.errorMessage = 'make sure each field has a valid value.'
  res.status(200).render('login', payload)
})

module.exports = router
