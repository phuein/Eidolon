// Socket.io
var socket = io()

var clientID // socket.id unique per client connection.

// Get own unique socket.id.
socket.on('socketID', function (socketid) {
  clientID = socketid
})

// Debugging.
socket.on('PageUpdate', () => {
  // Refresh page on changes.
  setTimeout(() => {
    location.reload()
  }, 1000)
})

// Admin access.
socket.on('AdminGranted', () => {
  editor.updateOptions({ readOnly: false })
})