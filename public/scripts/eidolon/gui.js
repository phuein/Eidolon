var updateFPSInterval = 500     // In milliseconds.

function createGUI(scene) {
  var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('myGUI')

  var fps = new BABYLON.GUI.TextBlock()

  fps.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
  fps.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
  fps.left = '-1%'
  fps.top = '1%'

  fps.text = '0'
  fps.color = 'white'
  fps.fontSize = 14
  fps.outlineWidth = 1
  fps.outlineColor = 'black'

  gui.addControl(fps)

  // Update by interval.
  var updateFPS = setInterval(function () {
    fps.text = parseInt(engine.getFps()).toString()
  }, updateFPSInterval)

  // References.
  scene.gui = gui
  scene.gui.fps = fps
  scene.gui.fps.updateFPS = updateFPS
}