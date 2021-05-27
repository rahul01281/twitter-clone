const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema(
  {
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // when we make a retweet, we will make a new post in the dashboard. if any post has the retweetData field, that means it is a retweet and then we will go and get the data and show the post
    retweetData: { type: Schema.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true }
)

var Post = mongoose.model('Post', PostSchema)
module.exports = Post
