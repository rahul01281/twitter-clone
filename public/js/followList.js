$(document).ready(() => {
  if (selectedTab === 'followers') loadFollowers()
  else loadFollowing()
})

function loadFollowers() {
  //get only the posts by the users not replies
  $.get(`/api/users/${profileUserId}/followers`, (users, status, xhr) => {
    outputUsers(users.followers, $('.resultsContainer'))
  })
}

function loadFollowing() {
  //get only the posts by the users not replies
  $.get(`/api/users/${profileUserId}/following`, (users, status, xhr) => {
    outputUsers(users.following, $('.resultsContainer'))
  })
}
