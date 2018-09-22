// Prevent accidental closing.
// window.onbeforeunload = function () {
//   return 'Are you sure you want to leave?'
// }

// Disable context menu, usually on right-click.
document.oncontextmenu = function (e) {
  return false
}

// After DOM loaded.
$(function () {
  // Attach chat and script to sidebars.
  $('#left').append($('#chat')[0])
  $('#right').append($('#scripts')[0])

  // Setup data and minimize.
  $('#left').data('restore-width', $('#left').css('width'))
  $('#right').data('restore-width', $('#right').css('width'))

  $('#left').animate({
    width: $('#left').css('min-width')
  }, 2000)
  // $('#right').animate({
  //   width: $('#right').css('min-width')
  // }, 2000)

  // Load code editor.
  editor = monaco.editor.create($('.script')[0], {
    value: 'function hello() {\n  console.log("hey")\n}',
    language: 'javascript',

    readOnly: true,

    roundedSelection: false,
    scrollBeyondLastLine: true,
    theme: 'vs',
    minimap: {
      enabled: true
    },
    autoIndent: true,
    automaticLayout: true,
    showUnused: true,
    dragAndDrop: false,
    // No suggestions popup.
    suggestOnTriggerCharacters: false,
    acceptSuggestionOnEnter: false,
    quickSuggestions: false,
    wordBasedSuggestions: false,
    lineNumbersMinChars: 3,
    contextmenu: false,
    lineDecorationsWidth: 8,

    wordWrap: 'bounded',
    tabSize: 2,
    // Enforce spaces over tabs.
    detectIndentation: false,
    insertSpaces: true,
    scrollbar: {
      vertical: 'hidden',
      verticalScrollbarSize: 0,
    }
  })
  // model.updateOptions({ tabSize: 8 })
})

// Clears all text selection (highlighting.)
function clearSelection() {
  if (document.selection && document.selection.empty) {
    document.selection.empty()
  } else if (window.getSelection) {
    let selection = window.getSelection()
    selection.removeAllRanges()
  }
}