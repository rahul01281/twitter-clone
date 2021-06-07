var connected = false

var socket = io('http://localhost:3003')
socket.emit('setup', userLoggedIn) //what emit does is that it broadcasts the fact that that event is fired

socket.on('connected', () => {
  connected = true
})

socket.on('message received', (newMessage) => {
  messageReceived(newMessage)
})
