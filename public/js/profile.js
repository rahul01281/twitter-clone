$(document).ready(() => {
  loadPosts()
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
