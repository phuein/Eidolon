/**
 * Generates details for a planet:
 * Ground
 * Water
 * Sky
 * Flora
 * Fauna
 */

function detailPlanet(planet) {
  // Material.
  planetMat = new BABYLON.StandardMaterial('planetMat', scene)
  planetMat.diffuseColor = new BABYLON.Color3(0.5, 0.3, 0.1)  // Brown.
  planetMat.specularColor = new BABYLON.Color3(0, 0, 0)
  // planetMat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.2)
  planet.material = planetMat

  // Water.
  // waterSphere = BABYLON.MeshBuilder.CreateSphere(
  //   'waterSphere',
  //   { segments: 64, diameter: planet.diameter * 1.5 },
  //   scene
  // )
  // waterSphere.isPickable = false
  // waterSphere.position = planet.position.clone()

  // Water material.
  // waterMat = new BABYLON.StandardMaterial('waterMat', scene)
  // waterMat.diffuseColor = new BABYLON.Color3(0.4, 0.5, 0.9)  // Aqua.
  // waterMat.specularColor = BABYLON.Color3.Black()
  // waterMat.backFaceCulling = false
  // waterSphere.material = waterMat
}