const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../models/UserSchema')
const Post = require('../../models/PostSchema')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

app.use(bodyParser.urlencoded({ extended: false }))

router.put('/:userId/follow', async (req, res, next) => {
  var userId = req.params.userId

  var user = await User.findById(userId)

  if (user === null) {
    return res.sendStatus(404)
  }
  var isFollowing =
    user.followers && user.followers.includes(req.session.user._id)

  var option = isFollowing ? '$pull' : '$addToSet'

  //insert the following
  req.session.user = await User.findByIdAndUpdate(
    req.session.user._id,
    { [option]: { following: userId } },
    { new: true } //new:true will make sure that findByIdAndUpdate will update the value and give back the newly updated document
  ).catch((error) => {
    console.log(error)
    res.sendStatus(400)
  })

  await User.findByIdAndUpdate(userId, {
    [option]: { followers: req.session.user._id },
  }).catch((error) => {
    console.log(error)
    res.sendStatus(400)
  })

  return res.status(200).send(req.session.user)
})

router.get('/:userId/following', async (req, res, next) => {
  User.findById(req.params.userId)
    .populate('following')
    .then((users) => {
      res.status(200).send(users)
    })
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

router.get('/:userId/followers', async (req, res, next) => {
  User.findById(req.params.userId)
    .populate('followers')
    .then((users) => {
      res.status(200).send(users)
    })
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

router.post(
  '/profilePicture',
  upload.single('croppedImage'),
  async (req, res, next) => {
    if (!req.file) {
      console.log('no file uploaded with ajax call')
      return res.sendStatus(400)
    }

    res.sendStatus(200)
  }
)

module.exports = router
