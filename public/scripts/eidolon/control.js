/**
 * Handles all operations for mesh & object control and modifications.
 * @param scene
 * @param camera
 */
function Control(scene, camera) {
  var _this = this

  this.scene      = scene
  this.camera     = camera
  this.mouse      = this.camera.inputs.attached.mouse
  this.keyboard   = this.camera.inputs.attached.keyboard

  this.previousParents    = {}      // mesh.uniqueId: parent object.
  this.scalingModifier    = 0.01    // Fits mouse delta to scaling.
  this.rotatingModifier   = 0.01
}

// Clears any applied controls, such as parenting.
Control.prototype.empty = function () {
  var _this = this

  // Restore Parent of all selected objects.
  $.each(player.selection.selected, function (uid, mesh) {
    if (_this.previousParents[uid]) {
      mesh.setParent(_this.previousParents[uid])
      delete _this.previousParents[uid]
    } else {
      // No parent.
      mesh.setParent()
    }
  })
}

// Move selected meshes around.
Control.prototype.move = function () {
  var _this = this

  // Parent all selected objects.
  $.each(player.selection.selected, function (uid, mesh) {
    // Remember original parent.
    if (mesh.parent)
      _this.previousParents[uid] = mesh.parent
    mesh.setParent(_this.camera)
  })
}

// Rotate selected meshes around.
Control.prototype.rotate = function () {
  var _this = this

  // Get delta from mouse movement.
  let dt = this.mouse.deltaMovement
  var x = dt.x * this.rotatingModifier
  var y = dt.y * this.rotatingModifier

  // Rotate all selected objects.
  $.each(player.selection.selected, function (uid, mesh) {
    _this.rotateByAxis(mesh, x, y)
  })
}

// Scale selected meshes around.
Control.prototype.scale = function () {
  var _this = this

  // Get delta from mouse movement.
  let dt = this.mouse.deltaMovement
  var x = dt.x * this.scalingModifier
  var y = dt.y * this.scalingModifier
  var d = x + (y / 2) // For any-direction scaling.

  // Scale all selected objects.
  $.each(player.selection.selected, function (uid, mesh) {
    // Alt provides more specific manipulation.
    if (_this.keyboard.alt)
      _this.scaleByAxis(mesh, x, y)
    else
      _this.scaleAll(mesh, d)
  })
}

/**
 * Scale all axis at once.
 * @param mesh
 * @param {Number} d
 */
Control.prototype.scaleAll = function (mesh, d) {
  // Shift scales twice as fast.
  if (this.keyboard.shift)
    d *= 2
  mesh.scaling.scaleInPlace(1 + (d))
}

/**
 * Scale each axis separately by mouse direction and key combination.
 * @param mesh
 * @param {Number} x
 * @param {Number} y
 */
Control.prototype.scaleByAxis = function (mesh, x, y) {
  mesh.scaling.x += x
  // Shift switches Y -> Z axis.
  if (this.keyboard.shift)
    mesh.scaling.z += y
  else
    mesh.scaling.y += y
}

/**
 * Rotate each axis separately by mouse direction and key combination.
 * @param mesh
 * @param {Number} x
 * @param {Number} y
 */
Control.prototype.rotateByAxis = function (mesh, x, y) {
  var v

  camera.computeWorldMatrix()
  var matrix = camera.getWorldMatrix(true).clone()

  v = new BABYLON.Vector3(0, 0, 1)
  var front = BABYLON.Vector3.TransformCoordinates(v, matrix).clone()

  v = new BABYLON.Vector3(1, 0, 0)
  var right = BABYLON.Vector3.TransformCoordinates(v, matrix).clone()

  v = new BABYLON.Vector3(0, 1, 0)
  var top = BABYLON.Vector3.TransformCoordinates(v, matrix).clone()

  // drawlines for debug
  // let pos = this.camera.position.clone();
  // drawLine(pos, front, true);
  // drawLine(pos, right);
  // drawLine(pos, top);

  // Create direction vectors from relative points.
  var dir = {
    x: right.subtractInPlace(pos),  // Right
    y: top.subtractInPlace(pos),    // Top
    z: front.subtractInPlace(pos)   // Front
  }

  // Rotate mesh from front vector.
  mesh.rotate(front, -x, BABYLON.Space.WORLD)

  // Shift switches side -> top vector.
  if (!this.keyboard.shift) {
    mesh.rotate(right, -y, BABYLON.Space.WORLD)
  } else {
    mesh.rotate(top, -y, BABYLON.Space.WORLD)
  }
}