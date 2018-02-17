"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var cannon_1 = require("cannon");
var diceconsts_1 = require("./diceconsts");
var dicelib_1 = require("./dicelib");
var three_1 = require("three");
var Die = /** @class */ (function (_super) {
    __extends(Die, _super);
    function Die() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.castShadow = false;
        _this.diceColor = '#202020';
        _this.labelColor = '#aaaaaa';
        _this.stopped = 0;
        _this.materialOptions = {
            specular: 0x172022,
            color: 0xf0f0f0,
            shininess: 40,
            shading: three_1.FlatShading
        };
        _this.geometryScale = 0.9;
        _this.faceLabels = diceconsts_1.DiceConsts.DISCRETE_LABELS;
        _this.margin = 1.0;
        return _this;
    }
    Object.defineProperty(Die.prototype, "body", {
        get: function () {
            if (!this._body) {
                this._body = new cannon_1.Body({
                    mass: this.constructor.mass,
                    material: Die.diceBodyMaterial
                });
                this._body.addShape(this.geometry.cannonShape);
            }
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Die.prototype, "threeQuaternion", {
        get: function () {
            var q = this.body.quaternion;
            return new three_1.Quaternion(q.x, q.y, q.z, q.w);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Die, "range", {
        get: function () {
            throw new Error('Derived class did not define range');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Die, "mass", {
        get: function () {
            throw new Error('Derived class did not define mass');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Die, "inertia", {
        get: function () {
            throw new Error('Derived class did not define inertia');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Die, "sides", {
        get: function () {
            throw new Error('Derived class did not define sides');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Die.prototype, "range", {
        get: function () {
            return this.constructor.range;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Die.prototype, "mass", {
        get: function () {
            return this.constructor.mass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Die.prototype, "inertia", {
        get: function () {
            return this.constructor.inertia;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Die.prototype, "sides", {
        get: function () {
            return this.constructor.sides;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Die.prototype, "value", {
        get: function () {
            var sides = this.constructor.sides;
            var vector = new three_1.Vector3(0, 0, sides === 4 ? -1 : 1);
            var closestFace;
            var closestAngle = Math.PI * 2;
            for (var i = 0, l = this.geometry.faces.length; i < l; ++i) {
                var face = this.geometry.faces[i];
                if (face.materialIndex == 0)
                    continue;
                var angle = face.normal
                    .clone()
                    .applyQuaternion(this.threeQuaternion)
                    .angleTo(vector);
                if (angle < closestAngle) {
                    closestAngle = angle;
                    closestFace = face;
                }
            }
            var matindex = closestFace.materialIndex - 1;
            if (sides === 100)
                matindex *= 10;
            return matindex;
        },
        enumerable: true,
        configurable: true
    });
    Die.prototype.createGeometry = function (radius) {
        return dicelib_1.createDiceGeometry(this.vertices, this.faces, radius, this.tab, this.af, this.chamfer);
    };
    Die.prototype.createMaterials = function (size) {
        var materials = [];
        for (var i = 0; i < this.faceLabels.length; ++i)
            materials.push(new three_1.MeshPhongMaterial(dicelib_1.copyto(this.materialOptions, {
                map: this.createTextTexture(this.faceLabels[i], this.labelColor, this.diceColor, size, this.margin)
            })));
        return materials;
    };
    Die.prototype.createMesh = function () {
        if (!this.geometry)
            this.geometry = this.createGeometry(this.scale.x * this.geometryScale);
        if (!this.material)
            this.material = new three_1.MeshFaceMaterial(this.createMaterials(this.scale.x / 2));
        return new three_1.Mesh(this.geometry, this.material);
    };
    Die.prototype.createTextTexture = function (text, color, backColor, size, margin) {
        if (text == undefined)
            return null;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var ts = dicelib_1.calculateTextureSize(size + size * 2 * margin) * 2;
        canvas.width = canvas.height = ts;
        context.font = ts / (1 + 2 * margin) + 'pt Arial';
        context.fillStyle = backColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = color;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        if (text == '6' || text == '9') {
            context.fillText('  .', canvas.width / 2, canvas.height / 2);
        }
        var texture = new three_1.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    };
    Die.diceBodyMaterial = new cannon_1.Material('dice');
    return Die;
}(three_1.Object3D));
exports.Die = Die;
//# sourceMappingURL=die.js.map