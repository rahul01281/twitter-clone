const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../models/UserSchema')
const Post = require('../../models/PostSchema')

app.use(bodyParser.urlencoded({ extended: false }))

router.put('/:userId/follow', async (req, res, next) => {
  var userId = req.params.userId

  var user = await User.findById(userId)

  if (user === null) {
    return res.sendStatus(404)
  }
  var isFollowing =
    user.followers && user.followers.includes(req.session.user._id)

  res.status(200).send(isFollowing)
})

module.exports = router
