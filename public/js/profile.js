$(document).ready(() => {
  loadPosts()
})

function loadPosts() {
  $.get('/api/posts', { postedBy: profileUserId }, (posts, status, xhr) => {
    outputPosts(posts, $('.postsContainer'))
  })
}
