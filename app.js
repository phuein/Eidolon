var path = require('path')
var public = path.join(__dirname, 'public')

// Timestamp.
function ts() {
  var now = new Date()
  var hour = ('0'+now.getHours()).slice(-2)
  var minute = ('0' +now.getMinutes()).toString().slice(-2)
  var second = ('0' +now.getSeconds()).toString().slice(-2)
  return '[' + hour + ':' + minute + '.' + second + ']'
}

var fs = require('fs')

var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(public))

app.get('/*', function(req, res){
  res.sendFile(path.join(public, 'views', 'index.html'))
})

// // sending to sender-client only
// socket.emit('message', "this is a test");

// // sending to all clients, include sender
// io.emit('message', "this is a test");

// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");

// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');

// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');

// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');

// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');

// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

io.on('connection', function (socket){
  // Debugging.
  // NOTE: Known bug, fires event twice.
  fs.watch(public, { recursive: true, persistent: false }, (eventType, filename) => {
    // Tell client site is modified.
    socket.emit('PageUpdate')
  })

  console.log(ts(), `User ${socket.id} connected!`)

  // Tell client its unique id.
  socket.emit('socketID', socket.id)

  // Check if admin by url.
  let alias = socket.handshake.headers.referer.split('/').pop()
  if (alias === 'phu') {
    socket.emit('AdminGranted')
    socket.admin = true
    console.log(`User ${socket.id} is admin!`)
  }

  socket.on('disconnect', function () {
    console.log(ts(), `User ${socket.id} disconnected.`)
  })

  socket.on('chatMessage', function (msg) {
    console.log(ts(), `${socket.id}: ${msg}`)
    io.emit('chatMessage', socket.id, msg)
  })
})

http.listen(80, function () {
  console.log('http listening on *:80')
})