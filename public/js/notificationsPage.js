$(document).ready(() => {
  $.get('/api/notifications', (notifications) => {
    outputNotificationsList(notifications, $('.resultsContainer'))
  })
})

function outputNotificationsList(notifications, container) {
  notifications.forEach((notification) => {
    var html = createNotificationHtml(notification)
    container.append(html)
  })

  if (notifications.length == 0) {
    container.append("<span class='noResults'>You have no notifications</span>")
  }
}

function createNotificationHtml(notification) {
  var userFrom = notification.userFrom
  var text = getNotificationText(notification)
  var href = getNotificationUrl(notification)

  return `<a href='${href}' class='resultListItem notification'>
                <div class='resultsImageContainer'>
                    <img src='${userFrom.profilePic}'>
                </div>
                 <div class='resultsDetailsContainer ellipsis'>
                    <span class='ellipsis'>${text}</span>
                </div>
            </a>`
}

function getNotificationText(notification) {
  var userFrom = notification.userFrom

  if (!userFrom.firstName || !userFrom.lastName)
    return alert('userFrom data not populated')

  var userFromName = `${userFrom.firstName} ${userFrom.lastName}`

  var text

  if (notification.notificationType == 'retweet') {
    text = `${userFromName} retweeted your post`
  } else if (notification.notificationType == 'postLike') {
    text = `${userFromName} liked your post`
  } else if (notification.notificationType == 'reply') {
    text = `${userFromName} replied to your post`
  } else if (notification.notificationType == 'follow') {
    text = `${userFromName} has started following you`
  }

  return `<span class='ellipsis'>${text}</span>`
}

function getNotificationUrl(notification) {
  var url = '#'

  if (
    notification.notificationType == 'retweet' ||
    notification.notificationType == 'postLike' ||
    notification.notificationType == 'reply'
  ) {
    url = `/post/${notification.entityId}`
  } else if (notification.notificationType == 'follow') {
    url = `/profile/${notification.entityId}`
  }

  return url
}
