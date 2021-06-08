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
  Notification.find({
    userTo: req.session.user._id,
    notificationType: { $ne: 'newMessage' },
  })
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

module.exports = router
