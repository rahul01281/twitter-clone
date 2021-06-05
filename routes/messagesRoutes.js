const express = require('express')
const app = express()
const router = express.Router()
const User = require('../models/UserSchema')
const Chat = require('../models/ChatSchema')
const mongoose = require('mongoose')

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

router.get('/:chatId', async (req, res, next) => {
  var userId = req.session.user._id
  var chatId = req.params.chatId
  var isValidId = mongoose.isValidObjectId(chatId)

  var payload = {
    pageTitle: 'Chat',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  }

  if (!isValidId) {
    payload.errorMessage =
      'Chat doesnot exist or you do not have the permission to view it'
    return res.status(200).render('chatPage', payload)
  }

  var chat = await Chat.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }).populate('users')

  if (chat == null) {
    // check if chat id is really user id
    var userFound = await User.findById(chatId)
    if (userFound != null) {
      //get chat using user id
    }
  }

  if (chat == null) {
    payload.errorMessage =
      'Chat doesnot exist or you do not have the permission to view it'
  } else {
    payload.chat = chat
  }

  res.status(200).render('chatPage', payload)
})

module.exports = router
