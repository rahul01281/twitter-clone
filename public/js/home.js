$(document).ready(() => {
  $.get('/api/posts', (posts, status, xhr) => {
    console.log(posts)
  })
})
