var canvas = $('#EidolonCanvas')

canvas.keyup(function (e) {
  // Focus chat input on Enter.
  if (e.which == 13) {
    e.stopPropagation()
    e.preventDefault()
    // Release mouse.
    document.exitPointerLock()
    chatTextarea.focus()
  }
})

canvas.mousedown(function (e) {
  // Ignore middle-mouse button page scroll.
  if (e.which == 2) {
    e.preventDefault()
  }
})

// Ignore Alt keypress for document, to keep locked cursor.
$(document).keyup(function (e) {
  // Focus chat input on Enter.
  if (e.which == 18) {
    e.stopPropagation()
    e.preventDefault()
  }
})

// Change into DOM element for babylon.
canvas = canvas[0]

// Globals.
// NOTE: Keep common objects accessible.
var engine, scene, camera, orb,
    select, control,
    planet

/**
 * The player {} Holds all the user metadata and objects.
 * Defaults to a glowing orb freely floating.
 * @class
 * @prop  {}  mesh  - Current controlled mesh.
 */
var player = {}

/**
 * Engine custom defaults.
 * @namespace
 * @prop    {number}  rayLength         - How far any ray should hit.
 * @prop    {number}  visibleDistance   - Trillion. Universe size.
 */
var defaults = {
  rayLength: 10000,
  visibleMinDistance: 0.1,
  visibleMaxDistance: 1000 * 1000 * 1000 * 1000
}

function initBabylon() {
  engine = new BABYLON.Engine(canvas, true, {
    stencil: true
  })
  BABYLON.AbstractMesh.__proto__.renderingGroupId = 1

  // Resize with window.
  window.addEventListener('resize', function () {
    engine.resize()
  })

  scene = createScene(canvas, engine)

  // FPS label.
  createGUI(scene)

  // Cannon.js
  scene.enablePhysics()   // (Gravity, Plugin)
  // orb.physicsImpostor = new BABYLON.PhysicsImpostor(
  //   orb,
  //   BABYLON.PhysicsImpostor.BoxImpostor,
  //   {
  //     mass: 1,
  //     restitution: 0.1,
  //     friction: 1
  //   },
  //   scene)

  // orb.physicsImpostor.physicsBody.world.addEventListener('postStep', () => {
  //   let body = orb.physicsImpostor.physicsBody
  //   let pos1 = orb.position.clone()
  //   let pos2 = planet.position.clone()
  //   // Direction of planet.
  //   let dir = pos2.subtract(pos1)
  //   body.force.set(dir.x, dir.y, dir.z).normalize()
  //   body.force.scale(1, body.force)                   // Magnitude.
  // })

  // Universe of stars.
  createUniverse(scene)
  // Sun and planet.
  createSolar(scene)

  engine.runRenderLoop(() => {
    scene.render()
  })
}

function createScene(canvas, engine) {
  // Create a basic BJS Scene object.
  scene = new BABYLON.Scene(engine)
  scene.clearColor = new BABYLON.Color3(0, 0, 0)
  // scene.ambientColor = new BABYLON.Color3(0.2, 0.2, 0.2)
  scene.constantlyUpdateMeshUnderPointer = true // For selection.
  scene.collisionsEnabled = true

  scenePointer()

  // Player's default mesh.
  orb = player.mesh = new BABYLON.MeshBuilder.CreateSphere('player_orb',
    { diameter: 1 })
  orb.isPickable = false
  orb.material = new BABYLON.StandardMaterial('player_orb_mat', scene)
  orb.material.emissiveColor = new BABYLON.Color4(0.5, 0.5, 1, 0.1)
  // orb.isVisible = false
  orb.checkCollisions = true
  orb.ellipsoid = new BABYLON.Vector3(1, 1, 1)
  orb.material.useLogarithmicDepth = true

  // Camera.
  camera = new BABYLON.UniversalCamera('player_camera', orb.position.clone(), scene)
  camera.parent = orb                         // Attach camera to its mesh.
  camera.position.set(0, 1, 10)
  camera.setTarget(orb.position)
  camera.minZ = defaults.visibleMinDistance
  camera.maxZ = defaults.visibleMaxDistance
  camera.fov = 0.65

  camera.speed        = 1000                  // Movement speed.
  camera.inertia      = 0.1                   // Added motion to move and look.
  camera.acceleration = 0.001                 // Rate of change for speed.
  camera.jerk         = 0.00001               // Rate of change for acceleration.

  // Remove default inputs.
  camera.inputs.clear()
  // Add custom inputs.
  camera.inputs.add(new MouseInput(camera))
  camera.inputs.add(new KeyboardInput(camera))

  // Attach to HTML element. Does preventDefault().
  camera.attachControl(canvas)

  // Handles marking and selection in scene.
  // select = new Selection(scene, camera)

  // Handles manipulating meshes.
  // control = new Control(scene, camera)

  // addSelectControl()

  // Create a basic top light 'sun'.
  // Gets attached to current sun.
  sunLight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3(0, 10000, 0), scene)

  return scene
}

function scenePointer() {
  scene.onPointerObservable.add(function (e) {
    // Mouse click.
    // NOTE: Usually ignored if mouse moved.
    if (e.type === BABYLON.PointerEventTypes.POINTERTAP) {
      // Pointerlock on any click.
      canvas.requestPointerLock()
    }
  })
}

function addSelectControl() {
  scene.onPointerObservable.add(function (e) {
    // Mouse move.
    if (e.type === BABYLON.PointerEventTypes.POINTERMOVE) {
      // Highlight mesh under cursor.
      select.mark()

      // With right button down.
      if (e.event.buttons === 2) {
        control.rotate()
      }

      // With middle button down.
      else if (e.event.buttons === 4) {
        control.scale()
      }
    } else

    // Mouse down.
    if (e.type === BABYLON.PointerEventTypes.POINTERDOWN) {
      // Add mesh under-cursor to selection, until mouse-up.
      let mesh = select.current
      if (mesh && !select.selected[mesh.uniqueId])
        select.select(mesh, true)

      // With left button down.
      if (e.event.buttons === 1) {
        // Translate.
        control.move()
      }
    } else

    // Mouse up.
    if (e.type === BABYLON.PointerEventTypes.POINTERUP) {
      // Clear all controls.
      control.empty()

      // Deselect temporary.
      let mesh = select.selected[select.temp]
      if (mesh)
        select.deselect(mesh, true)
    } else

    // Mouse doubleclick.
    if (e.type === BABYLON.PointerEventTypes.POINTERDOUBLETAP) {
      // Toggle select.
      select.toggleSelect()
    }
  })
}