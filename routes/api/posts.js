const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../models/UserSchema')
const Post = require('../../models/PostSchema')

app.use(bodyParser.urlencoded({ extended: false }))

router.get('/', async (req, res, next) => {
  // Post.find()
  //   .populate('postedBy')
  //   .populate('retweetData')
  //   .sort({ createdAt: -1 })
  //   .then(async (posts) => {
  //     posts = await User.populate(posts, { path: 'retweetData.postedBy' })
  //     res.status(200).send(posts)
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //     res.sendStatus(400)
  //   })

  var posts = await getPosts({})

  return res.status(200).send(posts)
})

router.get('/:id', async (req, res, next) => {
  var postId = req.params.id
  var postData = await getPosts({ _id: postId })
  postData = postData[0]

  var post = {
    postData: postData,
  }

  if (postData.replyTo !== undefined) {
    post.replyTo = postData.replyTo
  }

  //get all the posts who are the reply to the post we click on
  post.replies = await getPosts({ replyTo: postId })

  res.status(200).send(post)
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

  if (req.body.replyTo) {
    postData.replyTo = req.body.replyTo
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
    { new: true } //new:true will make sure that findByIdAndUpdate will update the value and give back the newly updated document
  ).catch((error) => {
    console.log(error)
    res.sendStatus(400)
  })

  //insert post like
  var post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { likes: userId } },
    { new: true }
  ).catch((error) => {
    console.log(error)
    res.sendStatus(400)
  })

  res.status(200).send(post)
})

router.post('/:id/retweet', async (req, res, next) => {
  var postId = req.params.id
  var userId = req.session.user._id

  //try and delete retweet => this means if we can delete it, it means we have unretweeted the tweet, if we can't delete it then it never existed and so we can just retweet it
  var deletedPost = await Post.findOneAndDelete({
    postedBy: userId,
    retweetData: postId,
  }).catch((error) => {
    console.log(error)
    res.sendStatus(400)
  })

  var option = deletedPost != null ? '$pull' : '$addToSet'

  var repost = deletedPost

  if (repost === null) {
    //create the retweet
    repost = await Post.create({ postedBy: userId, retweetData: postId }).catch(
      (error) => {
        console.log(error)
        res.sendStatus(400)
      }
    )
  }

  //the repost will either contain the post we want to add to user's list of retweets or contain the retweet we want to remove

  //update user retweet
  req.session.user = await User.findByIdAndUpdate(
    userId,
    { [option]: { retweets: repost._id } },
    { new: true }
  ).catch((error) => {
    console.log(error)
    res.sendStatus(400)
  }) //new:true will make sure that findByIdAndUpdate will update the value and give back the newly updated document

  //update post retweet
  var post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { retweetUsers: userId } },
    { new: true }
  ).catch((error) => {
    console.log(error)
    res.sendStatus(400)
  })

  res.status(200).send(post)
})

router.delete('/:id', (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(202))
    .catch((error) => {
      console.log(error)
      res.sendStatus(400)
    })
})

async function getPosts(filter) {
  var posts = await Post.find(filter)
    .populate('postedBy')
    .populate('retweetData')
    .populate('replyTo')
    .sort({ createdAt: -1 })
    .catch((error) => console.log(error))

  posts = await User.populate(posts, { path: 'replyTo.postedBy' })

  return await User.populate(posts, { path: 'retweetData.postedBy' })
}

module.exports = router
