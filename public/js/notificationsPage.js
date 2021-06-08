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

  return `<a href='#' class='resultListItem notification'>
                <div class='resultsImageContainer'>
                    <img src='${userFrom.profilePic}'>
                </div>
                 <div class='resultsDetailsContainer ellipsis'>
                    <span class='ellipsis'>this is the text</span>
                </div>
            </a>`
}
