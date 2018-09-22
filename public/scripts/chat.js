/** ** ** ** ** ** ** ** ** ** ** ** ** ** **
 *
 *  Chat
 *
 *      Public Messages
 *      Private Messages
 *
 *          User Aliases
 *          Timestamps
 *          Social Networks Integration
 *
** ** ** ** ** ** ** ** ** ** ** ** ** ** **/

var chatMessagesContainer = $('#chat > div:first-child')
var chatMessages = $('#chat > div:first-child > div')
var chatForm = $('#chat > div:last-child > form')
var chatTextarea = $('#chat > div:last-child > form > textarea')

chatTextarea.keydown(function (e) {
  // Enter
  if (e.which == 13) {
    // Newline on Shift+Enter.
    if (e.shiftKey) {
      e.stopPropagation()
    } else {
      e.stopPropagation()
      e.preventDefault()
      chatForm.submit()
      chatTextarea.val('')
    }
  } else
  // Escape
  if (e.which == 27) {
    e.stopPropagation()
    e.preventDefault()
  } else {
    // Don't affect canvas when typing.
    e.stopPropagation()
  }
})

chatTextarea.keyup(function (e) {
  // Escape
  if (e.which == 27) {
    // Lose focus.
    chatTextarea.blur()
    canvas.focus()
    canvas.requestPointerLock()
  }
})

chatForm.submit(function (e) {
  chatTextarea.val(chatTextarea.val().trim())

  // Ignore empty messages.
  if (chatTextarea.val() == '') {
    chatTextarea.val('')
    return false
  }

  socket.emit('chatMessage', chatTextarea.val())
  return false
})

$(function () {
  socket.on('chatMessage', function (id, msg) {
    // Apply HTML.
    msg = msg.replace(/\n/g, '<br>')
    // Add message to chat.
    var me = ''
    if (id == clientID) me = ' offset-1 myMessage'

    chatMessages.append('<div class="row">' +
            '<div class="col-11' + me + '">' + msg +
            '</div></div>')
    // Scroll down chat.
    chatMessagesContainer.stop().animate({
      scrollTop: chatMessagesContainer[0].scrollHeight
    }, 500)
  })
})