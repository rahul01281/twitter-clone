$(document).ready(() => {
  $.get('/api/posts', { followingOnly: true }, (posts, status, xhr) => {
    outputPosts(posts, $('.postsContainer'))
  })
})
