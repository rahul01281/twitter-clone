const express = require('express')
const app = express()
const router = express.Router()
const User = require('../models/UserSchema')

router.get('/', (req, res, next) => {
  var payload = {
    pageTitle: 'Inbox',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  }

  res.status(200).render('inboxPage', payload)
})

router.get('/new', (req, res, next) => {
  var payload = {
    pageTitle: 'New Message',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  }

  res.status(200).render('newMessage', payload)
})

router.get('/:chatId', (req, res, next) => {
  var payload = {
    pageTitle: 'Chat',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  }

  res.status(200).render('chatPage', payload)
})

module.exports = router
