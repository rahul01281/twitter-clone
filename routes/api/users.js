const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../models/UserSchema')
const Post = require('../../models/PostSchema')

app.use(bodyParser.urlencoded({ extended: false }))

router.put('/:userId/follow', async (req, res, next) => {
  res.status(200).send('yello')
})

module.exports = router
