const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../models/UserSchema')
const Chat = require('../../models/ChatSchema')

app.use(bodyParser.urlencoded({ extended: false }))

router.post('/', async (req, res, next) => {
  if (!req.body.users) {
    console.log('users params not sent with request')
    return res.sendStatus(400)
  }

  var users = JSON.parse(req.body.users)

  if (users.length == 0) {
    console.log('users array is empty')
    return res.sendStatus(400)
  }

  users.push(req.session.user)

  var chatData = {
    users: users,
    isGroupChat: true,
  }

  Chat.create(chatData)
    .then((data) => res.status(200).send(data))
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

router.get('/', async (req, res, next) => {
  //find all the chats the logged in user is a part of
  Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } } })
    .populate('users')
    .sort({ updatedAt: -1 })
    .then((chats) => res.status(200).send(chats))
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

router.get('/:chatId', async (req, res, next) => {
  //find all the chats the logged in user is a part of
  Chat.findOne({
    _id: req.params.chatId,
    users: { $elemMatch: { $eq: req.session.user._id } },
  })
    .populate('users')
    .then((chat) => res.status(200).send(chat))
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

router.put('/:chatId', async (req, res, next) => {
  //find all the chats the logged in user is a part of
  Chat.findByIdAndUpdate(req.params.chatId, req.body)
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

module.exports = router
