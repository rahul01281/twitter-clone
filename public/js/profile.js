$(document).ready(() => {
  if (selectedTab === 'replies') loadReplies()
  else loadPosts()
})

function loadPosts() {
  //get only the posts by the users not replies
  $.get(
    '/api/posts',
    { postedBy: profileUserId, isReply: false },
    (posts, status, xhr) => {
      outputPosts(posts, $('.postsContainer'))
    }
  )

  $.get(
    '/api/posts',
    { postedBy: profileUserId, pinned: true },
    (posts, status, xhr) => {
      outputPinnedPost(posts, $('.pinnedPostContainer'))
    }
  )
}

function loadReplies() {
  //get only the posts by the users not replies
  $.get(
    '/api/posts',
    { postedBy: profileUserId, isReply: true },
    (posts, status, xhr) => {
      outputPosts(posts, $('.postsContainer'))
    }
  )
}

function outputPinnedPost(posts, container) {
  if (posts.length == 0) {
    container.hide()
    return
  }

  container.html('')

  posts.forEach((post) => {
    var html = createPostHtml(post)
    container.append(html)
  })
}
