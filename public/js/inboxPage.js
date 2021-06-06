$(document).ready(() => {
  $.get('/api/chats', (data, status, xhr) => {
    if (xhr.status == 400) {
      alert('could not get chat list')
    } else {
      outputChatList(data, $('.resultsContainer'))
    }
  })
})

function outputChatList(chatList, container) {
  chatList.forEach((chat) => {
    var html = createChatHtml(chat)
    container.append(html)
  })

  if (chatList.length == 0) {
    container.append(
      "<span class='noResults'>You are not chatting with anyone</span>"
    )
  }
}

function createChatHtml(chatData) {
  var chatName = getChatName(chatData)
  var image = getChatImageElement(chatData)
  var latestMessage = getLatestMessage(chatData.latestMessage)

  return `<a href='/messages/${chatData._id}' class='resultListItem'>
                ${image}
                <div class='resultsDetailsContainer ellipsis'>
                    <span class='heading ellipsis'>${chatName}</span>
                    <span class='subText ellipsis'>${latestMessage}</span>
                </div>
            </a>`
}

function getLatestMessage(latestMessage) {
  if (latestMessage != null) {
    var sender = latestMessage.sender
    return `${sender.firstName} ${sender.lastName}: ${latestMessage.content}`
  }

  return 'New chat'
}

function getChatName(chatData) {
  var chatName = chatData.chatName

  if (!chatName) {
    var otherChatUsers = getOtherChatUsers(chatData.users)
    var namesArray = otherChatUsers.map(
      (user) => `${user.firstName} ${user.lastName}`
    )
    chatName = namesArray.join(', ')
  }

  return chatName
}

function getOtherChatUsers(users) {
  if (users.length == 1) return users

  return users.filter((user) => user._id != userLoggedIn._id)
}

function getChatImageElement(chatData) {
  var otherChatUsers = getOtherChatUsers(chatData.users)

  var groupChatClass = ''
  var chatImage = getUserChatImageElement(otherChatUsers[0])

  if (otherChatUsers.length > 1) {
    groupChatClass = 'groupChatImage'
    chatImage += getUserChatImageElement(otherChatUsers[1])
  }

  return `<div class='resultsImageContainer ${groupChatClass}'>
                ${chatImage}
            </div>`
}

function getUserChatImageElement(user) {
  if (!user || !user.profilePic) {
    return alert('user passed into function in invalid')
  }

  return `<img src='${user.profilePic}' alt='user profile pic'>`
}
