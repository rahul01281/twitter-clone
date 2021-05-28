$(document).ready(() => {
  $.get('/api/posts/' + postId, (posts, status, xhr) => {
    outputPosts(posts, $('.postsContainer'))
  })
})
