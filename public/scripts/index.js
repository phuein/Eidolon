// Load all Eidolon scripts after DOM loads.
var head = document.head
var scriptCounter = []
function scriptLoader(url) {
  let script = document.createElement('script')
  script.src = url
  script.type = 'text/javascript'

  // Add script url to counter array when loaded.
  function callback() {
    scriptCounter.push(url)
    // Finished loading all scripts.
    if (scriptCounter.length === scripts.length)
      scriptsLoaded()
  }

  script.onload = callback

  head.appendChild(script)
}

// Order of loading matters!
var scripts = [
  'scripts/client.js',                      // Socket server.

  'scripts/chat.js',                        // Chat.
  'scripts/interactElements.js',            // Resize elements.
  'scripts/dom.js',                         // Anything DOM related.

  'scripts/eidolon/movement/keyboard.js',   // Keyboard movement.
  'scripts/eidolon/movement/mouse.js',      // Mouse movement.
  'scripts/eidolon/select.js',              // Item selection.
  'scripts/eidolon/control.js',             // Item controls.
  'scripts/eidolon/create.js',              // Item creation & destruction.

  'scripts/eidolon/helpers.js',             // Miscellaneous functions for 3D.
  'scripts/eidolon/gui.js',                 // GUI that isn't DOM.
  'scripts/eidolon/generator/planet.js',    // Generates a main planet.
  'scripts/eidolon/generator/solar.js',     // Generates a solar system.
  'scripts/eidolon/generator/universe.js',  // Generates a universe.
  'scripts/eidolon/eidolon.js',             // 3D world.
]
// Load all scripts. Callback when finished.
$(scripts).each(function() {
  scriptLoader(this)
})

// All scripts were loaded. DOM ready.
function scriptsLoaded() {
  initBabylon()
}