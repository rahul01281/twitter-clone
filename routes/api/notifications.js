const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../models/UserSchema')
const Chat = require('../../models/ChatSchema')
const Message = require('../../models/MessageSchema')
const Notification = require('../../models/NotificationSchema')

app.use(bodyParser.urlencoded({ extended: false }))

router.get('/', async (req, res, next) => {
  var searchObj = {
    userTo: req.session.user._id,
    notificationType: { $ne: 'newMessage' },
  }

  if (req.query.unreadOnly !== undefined && req.query.unreadOnly == 'true') {
    searchObj.opened = false
  }

  Notification.find(searchObj)
    .populate('userTo')
    .populate('userFrom')
    .sort({ createdAt: -1 })
    .then((notifications) => {
      res.status(200).send(notifications)
    })
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

router.put('/:id/open', async (req, res, next) => {
  Notification.findByIdAndUpdate(req.params.id, { opened: true })
    .then(() => {
      res.sendStatus(200)
    })
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

router.put('/open', async (req, res, next) => {
  //this should mark all the notifications ad true which is of the user's
  Notification.updateMany({ userTo: req.session.user._id }, { opened: true })
    .then(() => {
      res.sendStatus(200)
    })
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

module.exports = router
