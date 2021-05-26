$(document).ready(() => {
  $.get('/api/posts', (posts, status, xhr) => {
    outputPosts(posts, $('.postsContainer'))
  })
})

function outputPosts(posts, container) {
  container.html('')

  posts.forEach((post) => {
    var html = createPostHtml(post)
    container.append(html)
  })

  if (posts.length === 0) {
    container.append("<span class='noResults'>Nothing to show :(</span>")
  }
}
