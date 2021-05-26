const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../models/UserSchema')
const Post = require('../../models/PostSchema')

app.use(bodyParser.urlencoded({ extended: false }))

router.get('/', (req, res, next) => {
  Post.find()
    .populate('postedBy')
    .sort({ createdAt: -1 })
    .then((posts) => res.status(200).send(posts))
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

router.post('/', (req, res, next) => {
  if (!req.body.content) {
    console.log('content param not sent with request')
    return res.sendStatus(400)
  }

  var postData = {
    content: req.body.content,
    postedBy: req.session.user,
  }

  Post.create(postData)
    .then(async (newPost) => {
      newPost = await User.populate(newPost, { path: 'postedBy' }) //populate the postedBy field using the UserSchema
      res.status(201).send(newPost)
    })
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

router.put('/:id/like', async (req, res, next) => {
  var postId = req.params.id
  var userId = req.session.user._id

  //checking if user has already liked the post
  var isLiked =
    req.session.user.likes && req.session.user.likes.includes(postId)

  var option = isLiked ? '$pull' : '$addToSet'

  //insert user like
  req.session.user = await User.findByIdAndUpdate(
    userId,
    { [option]: { likes: postId } },
    { new: true }
  ).catch((error) => {
    console.log(error)
    res.sendStatus(400)
  }) //new:true will make sure that findByIdAndUpdate will update the value and give back the newly updated document

  //insert post like

  res.status(200).send('hello')
})

module.exports = router
