$(document).ready(() => {
  socket.emit('join room', chatId) //it will emit an event to the server called "join room" and will pass in the chatId

  $.get(`/api/chats/${chatId}`, (data) => {
    $('#chatName').text(getChatName(data))
  })

  $.get(`/api/chats/${chatId}/messages`, (data) => {
    var messages = []
    var lastSenderId = ''

    data.forEach((message, index) => {
      var html = createMessageHtml(message, data[index + 1], lastSenderId)
      messages.push(html)

      lastSenderId = message.sender._id
    })

    var messagesHtml = messages.join('') //join every item in the array into a big string
    addMessagesHtmlToPage(messagesHtml)
    scrollToBottom(true)

    $('.loadingSpinnerContainer').remove()
    $('.chatContainer').css('visibility', 'visible')
  })
})

$('#chatNameButton').click(() => {
  var name = $('#chatNametextbox').val().trim()

  $.ajax({
    url: `/api/chats/${chatId}`,
    type: 'PUT',
    data: { chatName: name },
    success: (data, status, xhr) => {
      if (xhr.status != 204) alert('could not update')
      else location.reload()
    },
  })
})

$('.sendMessageButton').click(() => {
  messageSubmitted()
})

$('.inputTextbox').keydown((e) => {
  if (e.which === 13) {
    messageSubmitted()
    return false
  }
})

function addMessagesHtmlToPage(html) {
  $('.chatMessages').append(html)
}

function messageSubmitted() {
  var content = $('.inputTextbox').val().trim()

  if (content != '') {
    sendMessage(content)
    $('.inputTextbox').val('')
  }
}

function sendMessage(content) {
  $.post(
    '/api/messages',
    { content: content, chatId: chatId },
    (message, status, xhr) => {
      if (xhr.status != 201) {
        alert('could not send message')
        $('.inputTextbox').val(content)
        return
      }

      addChatMessageHtml(message)
    }
  )
}

function addChatMessageHtml(message) {
  if (!message || !message._id) {
    alert('message is not valid')
    return
  }

  var messageDiv = createMessageHtml(message, null, '')

  addMessagesHtmlToPage(messageDiv)
  scrollToBottom(true)
}

function createMessageHtml(message, nextMessage, lastSenderId) {
  var sender = message.sender
  var senderName = `${sender.firstName} ${sender.lastName}`

  var currentSenderId = sender._id

  var nextSenderId = nextMessage != null ? nextMessage.sender._id : ''

  var isFirst = lastSenderId != currentSenderId
  var isLast = nextSenderId != currentSenderId

  var isMine = message.sender._id == userLoggedIn._id
  var liClassNamme = isMine ? 'mine' : 'theirs'

  var nameElement = ''

  if (isFirst) {
    liClassNamme += ' first'

    if (!isMine) {
      nameElement = `<span class='senderName'>${senderName}</span>`
    }
  }

  var profileImage = ''

  if (isLast) {
    liClassNamme += ' last'
    profileImage = `<img src='${sender.profilePic}'>`
  }

  var imageContainer = ''

  if (!isMine) {
    imageContainer = `<div class='imageContainer'>
                        ${profileImage}
                      </div>`
  }

  return `<li class='message ${liClassNamme}'>
                ${imageContainer}
                <div class='messageContainer'>
                    ${nameElement}
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`
}

function scrollToBottom(animated) {
  var container = $('.chatMessages')
  var scrollHeight = container[0].scrollHeight

  if (animated) {
    container.animate({ scrollTop: scrollHeight }, 'slow')
  } else {
    container.scrollTop(scrollHeight)
  }
}
