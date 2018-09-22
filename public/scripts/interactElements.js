// Resizable elements. //

// Returns target element.
function onResizeMove(e, target) {
  // Update the element.
  resizeElement(target, e.rect.width, e.rect.height)
}

// Resizes element.
// NOTE: 0 is ignored.
function resizeElement(target, width, height) {
  if (width) {
    $(target).css('width', width)
  }

  if (height) {
    $(target).css('height', height)
  }
}

// Left sidebar.
interact('.resize-left')
  .resizable({
    edges: {
      left: false,
      right: true,
      top: false,
      bottom: false,
    },
    // keep the edges inside the parent
    restrictEdges: {
      outer: 'parent',
    },

    inertia: false,
  })

  // Resize element, if not beyond limits.
  .on('resizemove', function (e) {
    let target = e.target
    let t = $(target)

    onResizeMove(e, target)

    let w = parseInt(t.css('width'))
    let mw = parseInt(t.css('min-width'))

    // Limit.
    if (w <= mw)
      resizeElement(target, mw)
  })

  // Remember size, or minimize if small enough.
  .on('resizeend', function (e) {
    let target = e.target
    let t = $(target)

    let w = parseInt(t.css('width'))
    let mw = parseInt(t.css('min-width'))

    // Restore as long as bigger than min and px.
    if (w > mw && w > 50) {
      t.data('restore-width', w)
    } else {
      // Resize to min.
      resizeElement(target, mw)
    }

    // Selection happens before event, so clear it.
    clearSelection()
  })

  .on('doubletap', function (e) {
    let target = e.interaction.element
    // Clicking on resize edge toggles min / restore.
    if (target) {
      let t = $(target)

      let w = parseInt(t.css('width'))
      let mw = parseInt(t.css('min-width'))

      if (w <= mw) {
        // Restore.
        resizeElement(target, t.data('restore-width'))
      } else {
        // Minimize.
        resizeElement(target, mw)
      }

      // Selection happens before event, so clear it.
      clearSelection()
    }
  })

// Right sidebar.
interact('.resize-right')
  .resizable({
    edges: {
      left: true,
      right: false,
      top: false,
      bottom: false,
    },
    // keep the edges inside the parent
    restrictEdges: {
      outer: 'parent',
    },

    inertia: false,
  })

  // Resize element, if not beyond limits.
  .on('resizemove', function (e) {
    let target = e.target
    let t = $(target)

    onResizeMove(e, target)

    let w = parseInt(t.css('width'))
    let mw = parseInt(t.css('min-width'))

    // Limit.
    if (w <= mw)
      resizeElement(target, mw)
  })

  // Remember size, or minimize if small enough.
  .on('resizeend', function (e) {
    let target = e.target
    let t = $(target)

    let w = parseInt(t.css('width'))
    let mw = parseInt(t.css('min-width'))

    // Restore as long as bigger than min and px.
    if (w > mw && w > 50) {
      t.data('restore-width', w)
    } else {
      // Resize to min.
      resizeElement(target, mw)
    }

    // Selection happens before event, so clear it.
    clearSelection()
  })

  .on('doubletap', function (e) {
    let target = e.interaction.element
    // Clicking on resize edge toggles min / restore.
    if (target) {
      let t = $(target)

      let w = parseInt(t.css('width'))
      let mw = parseInt(t.css('min-width'))

      if (w <= mw) {
        // Restore.
        resizeElement(target, t.data('restore-width'))
      } else {
        // Minimize.
        resizeElement(target, mw)
      }

      // Selection happens before event, so clear it.
      clearSelection()
    }
  })

// Files tree under scripts.
interact('.resize-top')
  .resizable({
    edges: {
      left: false,
      right: false,
      top: true,
      bottom: false,
    },
    // keep the edges inside the parent
    restrictEdges: {
      outer: 'parent',
    },

    inertia: false,
  })

  // Resize element, if not beyond limits.
  .on('resizemove', function (e) {
    let target = e.target
    let t = $(target)

    onResizeMove(e, target)

    let w = parseInt(t.css('height'))
    let mw = parseInt(t.css('min-height'))

    // Limit.
    if (w <= mw)
      resizeElement(target, null, mw)
  })

  // Remember size, or minimize if small enough.
  .on('resizeend', function (e) {
    let target = e.target
    let t = $(target)

    let w = parseInt(t.css('height'))
    let mw = parseInt(t.css('min-height'))

    // Restore as long as bigger than min and px.
    if (w > mw && w > 100) {
      t.data('restore-height', w)
    } else {
      // Resize to min.
      resizeElement(target, null, mw)
    }

    // Selection happens before event, so clear it.
    clearSelection()
  })

  .on('doubletap', function (e) {
    let target = e.interaction.element
    // Clicking on resize edge toggles min / restore.
    if (target) {
      let t = $(target)

      let w = parseInt(t.css('height'))
      let mw = parseInt(t.css('min-height'))

      if (w <= mw) {
        // Restore.
        resizeElement(target, null, t.data('restore-height'))
      } else {
        // Minimize.
        resizeElement(target, null, mw)
      }

      // Selection happens before event, so clear it.
      clearSelection()
    }
  })