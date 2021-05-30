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
