$(document).ready(() => {
  $.get('/api/notifications', (notifications) => {
    outputNotificationsList(notifications, $('.resultsContainer'))
  })
})

$('#markNotificationsread').click(() => {
  markNotificationOpen()
})
