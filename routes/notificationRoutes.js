const express = require('express')
const app = express()
const router = express.Router()
const User = require('../models/UserSchema')
const Chat = require('../models/ChatSchema')
const mongoose = require('mongoose')

router.get('/', (req, res, next) => {
  var payload = {
    pageTitle: 'Notifications',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  }

  res.status(200).render('notificationsPage', payload)
})

module.exports = router
