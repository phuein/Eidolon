/**
 * Camera look-around controls for mouse.
 * @param {*}       camera
 * @param {boolean} touchEnabled
 * @param {boolean} noPreventDefault
 */
function MouseInput(camera, touchEnabled=true, noPreventDefault=false) {
  this.camera     = camera

  this.touchEnabled     = touchEnabled
  this.noPreventDefault = noPreventDefault

  this.buttons            = [0, 1, 2]         // Left, middle, right.
  this.angularSensibility = 1000.0            // Higher is less sensitive.
  this.previousPosition   = null              // { x: Number, y: Number }.
  this.deltaMovement      = { x: 0, y: 0 }    // Track mouse movement distance.

  // Disabled while these mouse buttons active.
  // NOTE: MouseEvent.buttons has different values for buttons!
  this.disabled = {
    2: true,    // Right
  }
}

/**
 * Hook mouse events.
 * @param {*} element
 */
MouseInput.prototype.attachControl = function (element) {
  this._observer = scene.onPointerObservable.add(
    (p, s) => { this._pointerInput(element, p, s) },
    BABYLON.PointerEventTypes.POINTERDOWN |
    BABYLON.PointerEventTypes.POINTERUP |
    BABYLON.PointerEventTypes.POINTERMOVE
  )

  element.addEventListener('mousemove', (e) => { this._onMouseMove(e) }, false)
}

/**
 * Unhook.
 * @param {*} element
 */
MouseInput.prototype.detachControl = function (element) {
  if (this._observer && element) {
    scene.onPointerObservable.remove(this._observer)

    if (this._onMouseMove) {
      element.removeEventListener('mousemove', this._onMouseMove)
    }

    this._observer        = null
    this.previousPosition = null
  }
}

MouseInput.prototype.getClassName = function () {
  return 'MouseInput'
}

MouseInput.prototype.getSimpleName = function () {
  return 'MouseInput'
}

// Track mouse movement, when pointer is not locked.
MouseInput.prototype._pointerInput = function (element, p, s) {
  var e = p.event

  if (engine.isInVRExclusivePointerMode) {
    return
  }

  if (!this.touchEnabled && e.pointerType === 'touch') {
    return
  }

  if (p.type !== BABYLON.PointerEventTypes.POINTERMOVE && this.buttons.indexOf(e.button) === -1) {
    return
  }

  var srcElement = (e.srcElement || e.target)
  // Mouse down.
  if (p.type === BABYLON.PointerEventTypes.POINTERDOWN && srcElement) {
    try {
      srcElement.setPointerCapture(e.pointerId)
    } catch (e) {
      // Nothing to do with the error. Execution will continue.
    }

    this.previousPosition = {
      x: e.clientX,
      y: e.clientY
    }

    if (!this.noPreventDefault) {
      e.preventDefault()
      element.focus()
    }
    // Mouse up.
  } else if (p.type === BABYLON.PointerEventTypes.POINTERUP && srcElement) {
    try {
      srcElement.releasePointerCapture(e.pointerId)
    } catch (e) {
      // Nothing to do with the error.
    }

    this.previousPosition  = null

    if (!this.noPreventDefault) {
      e.preventDefault()
    }
    // Track mouse movement, when pointer is NOT locked.
  } else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
    if (!this.previousPosition || engine.isPointerLock) {
      return
    }

    var offsetX = e.clientX - this.previousPosition.x
    var offsetY = e.clientY - this.previousPosition.y

    // Camera disabled while specified mouse buttons active.
    if (!this.disabled[e.buttons]) {
      this.rotateCamera(offsetX, offsetY, e.buttons)
    }

    this.deltaMovement = {
      x: offsetX,
      y: offsetY
    }

    this.previousPosition = {
      x: e.clientX,
      y: e.clientY
    }

    if (!this.noPreventDefault) {
      e.preventDefault()
    }
  }
}

// Track mouse movement, when pointer is locked.
MouseInput.prototype._onMouseMove = function (e) {
  if (!engine.isPointerLock || engine.isInVRExclusivePointerMode) {
    return
  }

  var offsetX = e.movementX || e.mozMovementX || e.webkitMovementX || e.msMovementX || 0
  var offsetY = e.movementY || e.mozMovementY || e.webkitMovementY || e.msMovementY || 0

  // Camera disabled while specified mouse buttons active.
  if (!this.disabled[e.buttons]) {
    this.rotateCamera(offsetX, offsetY, e.buttons)
  }

  this.deltaMovement = {
    x: offsetX,
    y: offsetY
  }

  this.previousPosition = null

  if (!this.noPreventDefault) {
    e.preventDefault()
  }
}

/**
 * Rotate camera by mouse offset.
 * @param {Number} offsetX
 * @param {Number} offsetY
 * @param {Number} buttons  1 is Left, 2 is Right, 4 is Middle.
 */
MouseInput.prototype.rotateCamera = function (offsetX, offsetY, buttons) {
  if (scene.useRightHandedSystem)
    offsetX *= -1

  // if (camera.parent && camera.parent._getWorldMatrixDeterminant() < 0)
  //   offsetX *= -1

  let angSen = this.angularSensibility
  // Shift rotates twice as fast.
  // if (camera.inputs.attached.keyboard.shift)
  //   angSen *= 0.5

  // Using reverse offsets.
  let x = -offsetY / angSen
  let y = offsetX / angSen

  // Rotate the orb.
  // let orb = this.camera.parent

  // Pitch and Yaw.
  if (buttons === 0 || buttons === 1) {
    // orb.rotation.x += x
    // orb.rotation.y += y
    orb.rotate(BABYLON.Axis.X, x, BABYLON.Space.LOCAL)
    orb.rotate(BABYLON.Axis.Y, y, BABYLON.Space.LOCAL)
    // this.camera.cameraRotation.x += x
    // this.camera.cameraRotation.y += y
    // BABYLON.Quaternion.RotationAxisToRef(rotationAxis, angle, pivot.rotationQuaternion)
  } else
  // Roll.
  if (buttons === 4) {
    // orb.rotation.z += y
    orb.rotate(BABYLON.Axis.Z, y, BABYLON.Space.LOCAL)
    // var z = Math.PI / y
    // BABYLON.Quaternion.RotationYawPitchRollToRef(camera.rotation.x, camera.rotation.x, z, )
    // camera._cameraRotationMatrix
  }
}