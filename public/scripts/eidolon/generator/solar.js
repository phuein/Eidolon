/**
 * Generates a solar system with a sun and a planet.
 */

var sunSize

function createSolar(scene) {
  createSun(scene)
  createMainPlanet(scene)
}

// Create the local sun.
function createSun(scene) {
  sunSize = starSize / 2      // Diameter to radius.
  var sunSphere = BABYLON.MeshBuilder.CreateSphere(
    'sunSphere',
    { segments: 64, diameter: sunSize },
    scene
  )
  sunSphere.hasVertexAlpha = true // BUG: Or stars render through.
  sunSphere.isPickable = false
  sunSphere.position = new BABYLON.Vector3(0, 0, -sunSize * 10)
  sunSphere.checkCollisions = true
  // Attach main sun light.
  sunLight.position = sunSphere.position.clone()

  var sunMat = new BABYLON.StandardMaterial('sunMat', scene)
  sunMat.specularColor = new BABYLON.Color3(0, 0, 0)
  sunMat.emissiveColor = new BABYLON.Color3(1, 1, 1)  // The sun is white in space to the naked eye.
  sunSphere.material = sunMat

  // Create the "God Rays" effect (volumetric light scattering.)
  var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 2.0, camera, sunSphere, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false)
}

// Create the local main planet.
function createMainPlanet(scene) {
  var planetSize = 1000 * 1000
  planet = BABYLON.MeshBuilder.CreateSphere(
    'planetSphere',
    {
      segments: 64,
      diameter: planetSize,
    },
    scene
  )
  planet.hasVertexAlpha = true   // BUG: Or stars render through.
  planet.diameter = planetSize   // Reference.
  planet.isPickable = false
  planet.position = new BABYLON.Vector3(planetSize * 0.5, -planetSize * 0.5, -planetSize)
  planet.checkCollisions = true

  detailPlanet(planet)
}