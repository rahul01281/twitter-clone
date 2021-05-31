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

function outputUsers(data, container) {
  container.html('')
  data.forEach((user) => {
    var html = createUserHtml(user, true)
    container.append(html)
  })

  if (data.length == 0) {
    container.append("<span class='noResults'>No results found.</span>")
  }
}

function createUserHtml(userData, showFollowButton) {
  var name = userData.firstName + ' ' + userData.lastName
  return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}</span>
                    </div>
                </div>
            </div>`
}
