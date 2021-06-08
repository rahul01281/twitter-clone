const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../models/UserSchema')
const Post = require('../../models/PostSchema')
const Notification = require('../../models/NotificationSchema')

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

  var searchObject = req.query

  //means isReply field exists
  if (searchObject.isReply !== undefined) {
    var isReply = searchObject.isReply == 'true'
    searchObject.replyTo = { $exists: isReply } // filter based on replyTo field. if isReply exists, then it will return that document
    delete searchObject.isReply //remove the isReply field
  }

  if (searchObject.search !== undefined) {
    searchObject.content = { $regex: searchObject.search, $options: 'i' } //$options: "i" means case insensitive search
    delete searchObject.search //remove the search field
  }

  if (searchObject.followingOnly !== undefined) {
    var followingOnly = searchObject.followingOnly == 'true'

    if (followingOnly) {
      var objectIds = [] //get ids of all the users the person is following

      if (!req.session.user.following) {
        req.session.user.following = []
      }
      req.session.user.following.forEach((user) => {
        objectIds.push(user)
      })

      objectIds.push(req.session.user._id) //see own posts on the news feed

      searchObject.postedBy = { $in: objectIds } // find all posts where posted by is anywhere in the onjectIds array
    }

    delete searchObject.followingOnly //remove the followingOnly field
  }

  var posts = await getPosts(searchObject)

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
      newPost = await Post.populate(newPost, { path: 'replyTo' }) //populate the replyTo field using the PostSchema
      if (newPost.replyTo !== undefined) {
        await Notification.insertNotification(
          newPost.replyTo.postedBy,
          req.session.user._id,
          'reply',
          newPost._id
        )
      }
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

  if (!isLiked) {
    await Notification.insertNotification(
      post.postedBy,
      userId,
      'postLike',
      post._id
    )
  }

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

  if (!deletedPost) {
    await Notification.insertNotification(
      post.postedBy,
      userId,
      'retweet',
      post._id
    )
  }

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

router.put('/:id', async (req, res, next) => {
  if (req.body.pinned !== undefined) {
    await Post.updateMany(
      { postedBy: req.session.user },
      { pinned: false }
    ).catch((error) => {
      console.log(error)
      res.sendStatus(400)
    }) //get all the posts by us and set the pinned property to false
  }

  Post.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.sendStatus(204))
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
