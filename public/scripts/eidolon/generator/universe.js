/**
 * Generates a false galaxy of shiny stars.
 */

var galaxySize, starSize

function createUniverse(scene) {
  galaxySize  = defaults.visibleMaxDistance     // Smaller than reality.
  starSize    = galaxySize / 1000               // Max.

  var particlesUniverse = new BABYLON.ParticleSystem('particlesUniverse', 1000 * 1000, scene)

  particlesUniverse.particleTexture = new BABYLON.Texture(
    'media/flare2.png',
    scene
  )
  particlesUniverse.textureMask = new BABYLON.Color3(0, 0, 0)
  particlesUniverse.addColorGradient(
    0,
    new BABYLON.Color3(1, 0.9, 0.9),    // Red tint.
    new BABYLON.Color3(0.8, 0.8, 1),    // Blue tint.
  )
  particlesUniverse.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE

  particlesUniverse.emitter = new BABYLON.Vector3(0, 0, 0)
  var emitterType = particlesUniverse.createSphereEmitter(galaxySize)
  emitterType.radiusRange = 0.25                              // Place away from center.
  particlesUniverse.particleEmitterType = emitterType
  particlesUniverse.manualEmitCount = 1000 * 100              // Actual amount, static.
  particlesUniverse.updateSpeed = 0.05
  // No movement.
  particlesUniverse.minEmitPower = particlesUniverse.maxEmitPower = 0
  // Make them shine by rotating on Z slowly.
  particlesUniverse.minAngularSpeed = particlesUniverse.maxAngularSpeed = 0.01

  particlesUniverse.minSize = starSize / 5
  particlesUniverse.maxSize = starSize

  particlesUniverse.minLifeTime = particlesUniverse.maxLifeTime = 100000000 // Forever.

  particlesUniverse.updateFunction = updateFunction
  particlesUniverse.start()
}

// Override default to maximize efficiency.
function updateFunction(particles) {
  var this_1 = this, particle

  for (var index = 0; index < particles.length; index++) {
    particle = particles[index]
    particle.age += this_1._scaledUpdateSpeed

    var ratio = particle.age / particle.lifeTime

    // Angular speed
    if (this_1._angularSpeedGradients && this_1._angularSpeedGradients.length > 0) {
      Tools.GetCurrentGradient(ratio, this_1._angularSpeedGradients, function (currentGradient, nextGradient, scale) {
        if (currentGradient !== particle._currentAngularSpeedGradient) {
          particle._currentAngularSpeed1 = particle._currentAngularSpeed2
          particle._currentAngularSpeed2 = nextGradient.getFactor()
          particle._currentAngularSpeedGradient = currentGradient
        }
        particle.angularSpeed = Scalar.Lerp(particle._currentAngularSpeed1, particle._currentAngularSpeed2, scale)
      })
    }
    particle.angle += particle.angularSpeed * this_1._scaledUpdateSpeed
  }
}