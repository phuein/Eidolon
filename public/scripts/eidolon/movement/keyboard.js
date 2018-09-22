/**
 * Camera move-around controls for keyboard with WASD.
 * @param {*} camera
 */
function KeyboardInput(camera, noPreventDefault=false) {
  this.camera = camera

  this._keys          = []

  this.noPreventDefault = noPreventDefault

  // Identify metakeys from event.
  this.shift          = false
  this.alt            = false

  this.keysForward    = [87]
  this.keysBackward   = [83]
  this.keysRight      = [68]
  this.keysLeft       = [65]
  this.keysUp         = [69]
  this.keysDown       = [81]
  this.sensibility    = 0.01

  // Track movement speed for acceleration.
  this.speed        = camera.speed
  this.acceleration = camera.acceleration
  this.lastInput    = 0                         // new Date()
  this.resetTimeout = 1000                      // Milliseconds.
}

/**
 * Hook keyboard events.
 * @param {*} element
 */
KeyboardInput.prototype.attachControl = function (element) {
  if (this._onCanvasBlurObserver) {
    return
  }

  this._onCanvasBlurObserver = engine.onCanvasBlurObservable.add(
    () => { this._keys = [] }
  )

  this._onKeyboardObserver = scene.onKeyboardObservable.add(
    (info) => { this._onKeyboardInput(info) }
  )
}

/**
 * Unhook.
 * @param {*} element
 */
KeyboardInput.prototype.detachControl = function (element) {
  if (scene) {
    if (this._onKeyboardObserver) {
      scene.onKeyboardObservable.remove(this._onKeyboardObserver)
    }

    if (this._onCanvasBlurObserver) {
      engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver)
    }

    this._onKeyboardObserver = null
    this._onCanvasBlurObserver = null
  }

  this._keys = []
}

KeyboardInput.prototype.getClassName = function () {
  return 'KeyboardInput'
}

KeyboardInput.prototype.getSimpleName = function () {
  return 'keyboard'
}

KeyboardInput.prototype._onLostFocus = function (e) {
  this._keys = []
}

KeyboardInput.prototype._onKeyboardInput = function (info) {
  var e = info.event
  var index
  if (info.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
    // Metakeys.
    this.shift = e.shiftKey
    this.alt = e.altKey

    if (this.keysForward.indexOf(e.keyCode)  !== -1 ||
        this.keysBackward.indexOf(e.keyCode) !== -1 ||
        this.keysRight.indexOf(e.keyCode)    !== -1 ||
        this.keysLeft.indexOf(e.keyCode)     !== -1 ||
        this.keysUp.indexOf(e.keyCode)       !== -1 ||
        this.keysDown.indexOf(e.keyCode)     !== -1) {

      index = this._keys.indexOf(e.keyCode)

      if (index === -1) {
        this._keys.push(e.keyCode)
      }

      if (!this.noPreventDefault) {
        e.preventDefault()
      }

    }
  } else {
    // Reset metakeys.
    this.shift = false
    this.alt = false

    if (this.keysForward.indexOf(e.keyCode)  !== -1 ||
        this.keysBackward.indexOf(e.keyCode) !== -1 ||
        this.keysRight.indexOf(e.keyCode)    !== -1 ||
        this.keysLeft.indexOf(e.keyCode)     !== -1 ||
        this.keysUp.indexOf(e.keyCode)       !== -1 ||
        this.keysDown.indexOf(e.keyCode)     !== -1) {

      index = this._keys.indexOf(e.keyCode)

      if (index >= 0) {
        this._keys.splice(index, 1)
      }

      if (!this.noPreventDefault) {
        e.preventDefault()
      }

    }
  }
}

/**
 * This function is called by the system on every frame.
 */
KeyboardInput.prototype.checkInputs = function () {
  if (this._onKeyboardObserver) {
    let camera = this.camera

    // Keyboard
    for (var index = 0; index < this._keys.length; index++) {
      var keyCode = this._keys[index]

      // Restore to default speed if inactive for too long.
      let d = new Date() - this.lastInput
      if (d > this.resetTimeout) {
        this.speed = camera.speed
        this.acceleration = camera.acceleration
      }
      this.lastInput = new Date()

      // Shift + Alt is hyper space increase speed more!
      if (this.shift && this.alt) {
        this.speed *= 1 + this.acceleration
        this.acceleration += camera.jerk * 10
      } else
      // Shift increases speed.
      if (this.shift) {
        this.speed *= 1 + this.acceleration
        this.acceleration += camera.jerk
      } else
      // Alt reduces speed.
      if (this.alt) {
        this.speed *= 1 - this.acceleration
        this.acceleration += camera.jerk
      }

      // if (scene.useRightHandedSystem) {
      //   camera._localDirection.z *= -1
      // }

      // Move the orb.
      let orb = camera.parent
      // Must have physics ready.
      // if (!(orb.physicsImpostor && orb.physicsImpostor.physicsBody))
      //   return

      // let body = orb.physicsImpostor.physicsBody

      if (this.keysForward.indexOf(keyCode) !== -1) {
        orb.translate(BABYLON.Axis.Z, -this.speed, BABYLON.Space.LOCAL)
      }
      if (this.keysBackward.indexOf(keyCode) !== -1) {
        orb.translate(BABYLON.Axis.Z, this.speed, BABYLON.Space.LOCAL)
      }
      if (this.keysRight.indexOf(keyCode) !== -1) {
        orb.translate(BABYLON.Axis.X, -this.speed, BABYLON.Space.LOCAL)
      }
      if (this.keysLeft.indexOf(keyCode) !== -1) {
        orb.translate(BABYLON.Axis.X, this.speed, BABYLON.Space.LOCAL)
      }
      if (this.keysUp.indexOf(keyCode) !== -1) {
        orb.translate(BABYLON.Axis.Y, this.speed, BABYLON.Space.LOCAL)
      }
      if (this.keysDown.indexOf(keyCode) !== -1) {
        orb.translate(BABYLON.Axis.Y, -this.speed, BABYLON.Space.LOCAL)
      }







      // Inertia.
      // if (Math.abs(this.cameraDirection.x) < this.speed * Epsilon) {
      //   this.cameraDirection.x = 0
      // }

      // if (Math.abs(this.cameraDirection.y) < this.speed * Epsilon) {
      //   this.cameraDirection.y = 0
      // }

      // if (Math.abs(this.cameraDirection.z) < this.speed * Epsilon) {
      //   this.cameraDirection.z = 0
      // }

      // this.cameraDirection.scaleInPlace(this.inertia)

      // camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix)
      // BABYLON.Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection)
      // camera.cameraDirection.addInPlace(camera._transformedDirection)
    }
  }
}