const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')

app.set('view engine', 'pug') //setting the view engine to pug
app.set('views', 'views') //go to folder called

app.use(bodyParser.urlencoded({ extended: false }))

router.get('/', (req, res, next) => {
  payload = {
    title: 'Register',
  }
  res.status(200).render('register', payload)
})

router.post('/', (req, res, next) => {
  console.log(req.body)
  payload = {
    title: 'Register',
    errorMessage: 'Make sure each field has valid value.',
  }

  var firstName = req.body.firstName.trim()
  var lastName = req.body.lastName.trim()
  var username = req.body.username.trim()
  var email = req.body.email.trim()
  var password = req.body.password

  if (firstName && lastName && username && email && password) {
  } else {
  }

  res.status(200).render('register', payload)
})

module.exports = router
