$(document).ready(() => {
  $.get('/api/posts', (posts, status, xhr) => {
    outputPosts(posts, $('.postsContainer'))
  })
})
