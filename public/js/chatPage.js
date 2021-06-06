$(document).ready(() => {
  $.get(`/api/chats/${chatId}`, (data) => {
    $('#chatName').text(getChatName(data))
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

  var messageDiv = createMessageHtml(message)

  $('.chatMessages').append(messageDiv)
}

function createMessageHtml(message) {
  var isMine = message.sender._id == userLoggedIn._id
  var liClassNamme = isMine ? 'mine' : 'theirs'

  return `<li class='message ${liClassNamme}'>
                <div class='messageContainer'>
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`
}
