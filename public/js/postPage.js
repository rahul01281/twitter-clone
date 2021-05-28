$(document).ready(() => {
  $.get('/api/posts/' + postId, (posts, status, xhr) => {
    outputPostsWithReplies(posts, $('.postsContainer'))
  })
})
