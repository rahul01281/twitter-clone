const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../models/UserSchema')
const Post = require('../../models/PostSchema')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require('path')
const fs = require('fs')
const Notification = require('../../models/NotificationSchema')

app.use(bodyParser.urlencoded({ extended: false }))

router.get('/', async (req, res, next) => {
  var searchObject = req.query

  if (req.query.search !== undefined) {
    searchObject = {
      $or: [
        //$or is a mongodb operator which is gonna let any of these conditions is gonna met
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { username: { $regex: req.query.search, $options: 'i' } },
      ],
    }
  }

  User.find(searchObject)
    .then((users) => {
      res.status(200).send(users)
    })
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

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

  if (!isFollowing) {
    await Notification.insertNotification(
      userId,
      req.session.user._id,
      'follow',
      req.session.user._id
    )
  }

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

    var filePath = `/uploads/images/${req.file.filename}.png`
    var tempPath = req.file.path //this is the location where the image currently is
    var targetPath = path.join(__dirname, `../../${filePath}`) //put this file here

    fs.rename(tempPath, targetPath, async (error) => {
      if (error != null) {
        console.log(error)
        return res.sendStatus(400)
      }

      req.session.user = await User.findByIdAndUpdate(
        req.session.user._id,
        { profilePic: filePath },
        { new: true }
      )
      res.sendStatus(204)
    })
  }
)

router.post(
  '/coverPhoto',
  upload.single('croppedImage'),
  async (req, res, next) => {
    if (!req.file) {
      console.log('no file uploaded with ajax call')
      return res.sendStatus(400)
    }

    var filePath = `/uploads/images/${req.file.filename}.png`
    var tempPath = req.file.path //this is the location where the image currently is
    var targetPath = path.join(__dirname, `../../${filePath}`) //put this file here

    fs.rename(tempPath, targetPath, async (error) => {
      if (error != null) {
        console.log(error)
        return res.sendStatus(400)
      }

      req.session.user = await User.findByIdAndUpdate(
        req.session.user._id,
        { coverPhoto: filePath },
        { new: true }
      )
      res.sendStatus(204)
    })
  }
)

module.exports = router
