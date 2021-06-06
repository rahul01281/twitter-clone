$(document).ready(() => {
  $.get('/api/posts', { followingOnly: true }, (posts, status, xhr) => {
    outputPosts(posts, $('.postsContainer'))

    $('.loadingSpinnerContainer').remove()
    $('.postsContainer').css('visibility', 'visible')
  })
})
