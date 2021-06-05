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
      console.log(message)
    }
  )
}
