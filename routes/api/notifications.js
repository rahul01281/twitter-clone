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
  res.status(200).send('it worked')
})

module.exports = router
