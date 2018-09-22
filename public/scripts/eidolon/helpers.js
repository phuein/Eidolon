// Return object localized vector.
function vecToLocal(vec, obj) {
  var m = obj.getWorldMatrix()
  var v = BABYLON.Vector3.TransformCoordinates(vec, m)
  return v
}

// Cast a forward ray and return hit object.
// e.hit, e.pickedMesh
function castRay(source, length=defaults.rayLength) {
  var origin = source.position

  var forward = new BABYLON.Vector3(0, 0, 1)
  forward = vecToLocal(forward, source)

  var direction = forward.subtract(origin)
  direction = BABYLON.Vector3.Normalize(direction)

  var ray = new BABYLON.Ray(origin, direction, length)

  // BABYLON.RayHelper.CreateAndShow(ray, scene, new BABYLON.Color3(1, 1, 1)) // Debugging.

  var e = scene.pickWithRay(ray)

  return e
}

var oldLines = []
function drawLine(a, b, renew, color) {
  if (renew) {
    $.each(oldLines, function (i, v) {
      scene.removeMesh(v)
    })
    oldLines = []
  }

  var myPoints = [a, b]

  // Default to random bright colors.
  if (!color) {
    let x = (Math.random() * (100 - 50) + 50) / 100
    let y = (Math.random() * (100 - 50) + 50) / 100
    let z = (Math.random() * (100 - 50) + 50) / 100
    color = new BABYLON.Color4(x, y, z, 1)
  }

  // Creates lines from points.
  var lines = BABYLON.MeshBuilder.CreateLines('lines',
    {
      points: myPoints,
      colors: [color, color]
    },
    scene)

  oldLines.push(lines)

  return lines
}