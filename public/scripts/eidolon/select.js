/**
 * Handles all operations for mesh marking and selection.
 * @param scene
 * @param camera
 */
function Selection(scene, camera) {
  var _this = this

  this.scene = scene
  this.camera = camera

  this.current           // Current mesh under cursor.
  this.selected = {}     // All meshes that are selected.
  this.temp              // Temporary selection mesh.uniqueId (until mouse-up.)

  // Highlight colors for selectable mesh, selected meshes,
  // and marked selected mesh.
  this.markColor          = new BABYLON.Color3(0.0, 0.0, 0.5)
  this.selectColor        = new BABYLON.Color3(0.2, 0.0, 0.5)
  this.markSelectedColor  = new BABYLON.Color3(0.5, 0.0, 0.7)

  // Highlight layers for selectable and selected meshes in scene.
  /*
    this.highlightMarked    = {
        layers: {
            1: new BABYLON.HighlightLayer("highlightMarked1", scene),
            2: new BABYLON.HighlightLayer("highlightMarked2", scene),
            3: new BABYLON.HighlightLayer("highlightMarked3", scene),
            4: new BABYLON.HighlightLayer("highlightMarked4", scene)
        },

        current: 1,
        // Changes current, and returns next number.
        next: function () {
            let i = this.current;
            let l = Object.keys(this.layers).length;
            if (this.current === l)
                this.current = 1;
            else
                this.current += 1;
            return i;
        },

        removeMesh: function (mesh) {
            // Remove from all layers.
            $.each(this.layers, function (i, v) {
                v.removeMesh(mesh);
                delete this._meshes[mesh.uniqueId];
            });
        },

        addMesh: function (mesh, color) {
            let i = this.next();
            this.layers[i].addMesh(mesh, color);
            this._meshes[mesh.uniqueId] = mesh;
        },

        // Holds all meshs from all layers.
        _meshes: {}
    };
    */
  this.highlightMarked = new BABYLON.HighlightLayer('highlightMarked', scene, {
    camera: this.camera
  })
  this.highlightSelected = new BABYLON.HighlightLayer('highlightSelected', scene, {
    camera: this.camera
  })

  // Animate highlights.
  var alpha = 0
  scene.registerBeforeRender(() => {
    // Change in highlight amount.
    alpha += 0.02
    // Highlight layers.
    /*
        $.each(_this.highlightMarked.layers, function (i, v) {
            v.blurHorizontalSize = v.blurVerticalSize =
            1 - Math.cos(alpha) * 0.4;
        });
        */
    _this.highlightMarked.blurHorizontalSize =
            _this.highlightMarked.blurVerticalSize =
            1 - Math.cos(alpha) * 0.4
    // Selection layer.
    _this.highlightSelected.blurHorizontalSize =
        _this.highlightSelected.blurVerticalSize =
        1 - Math.cos(alpha) * 0.4
  })
}

/**
 * @returns mesh {} from castRay and camera.
 */
Selection.prototype.hit = function () {
  let hit = castRay(this.camera, defaults.rayLength)
  // No mesh to select.
  if (hit.hit)
    return hit.pickedMesh
}

/**
 * Un/Mark hovered mesh. Only one can be marked.
 */
Selection.prototype.mark = function () {
  let mesh = this.hit()

  // No mesh to mark.
  if (!mesh) {
    // Clear previous mark.
    if (this.current)
      this.clearHighlight(this.current)
    // Update current.
    delete this.current
    return
  }

  // Already marking a mesh.
  if (this.current) {
    // New overlapping mesh, or deselected mesh needs refreshing.
    if (this.current !== mesh)
    // New mark. Clear previous.
      this.clearHighlight(this.current)
    else {
      // A deselected mesh might lose its marking and require a refresh.
      if (this.highlightMarked._meshes[mesh.uniqueId])
      // Same mesh as previous, do nothing.
        return
    }
  }

  if (this.selected[mesh.uniqueId]) {
    // Selected mesh changes highlight color only.
    this.highlightSelected._meshes[mesh.uniqueId].color = this.markSelectedColor
  } else {
    // Highlight mesh.
    this.highlightMarked.addMesh(mesh, this.markColor)
  }

  // Update current.
  this.current = mesh
}

/**
 * Toggle mesh from selection, including highlight.
 */
Selection.prototype.toggleSelect = function () {
  let mesh = this.current

  // No mesh to select.
  if (!mesh)
    return

  // Deselect as temp, so it can be selected.
  if (this.temp === mesh.uniqueId)
    this.deselect(mesh, true)

  // Toggle selection.
  if (this.selected[mesh.uniqueId])
    this.deselect(mesh)
  else
    this.select(mesh)
}

/**
 * Add mesh to selection, including highlight.
 * @param mesh
 * @param temp
 */
Selection.prototype.select = function (mesh, temp) {
  // Temporary selection, until mouse-up.
  if (temp)
    this.temp = mesh.uniqueId
    // Unmark.
  this.highlightMarked.removeMesh(mesh)
  // Select.
  this.selected[mesh.uniqueId] = mesh
  this.highlightSelected.addMesh(mesh, this.selectColor)
}

/**
 * Remove mesh from selection, including highlight.
 * @param mesh
 * @param temp
 */
Selection.prototype.deselect = function (mesh, temp) {
  // Reset temporary selection.
  if (temp)
    this.temp = null
    // Remove from selection.
  delete this.selected[mesh.uniqueId]
  // Unmark to reset marking.
  this.highlightSelected.removeMesh(mesh)
}

/**
 * Clear the marked or selected mesh.
 * @param mesh
 */
Selection.prototype.clearHighlight = function (mesh) {
  if (this.selected[mesh.uniqueId]) {
    // Selected mesh reverts to selection color.
    this.highlightSelected._meshes[mesh.uniqueId].color = this.selectColor
  } else {
    this.highlightMarked.removeMesh(mesh)
  }
}