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
var die_1 = require("./die");
var diceconsts_1 = require("./diceconsts");
var three_1 = require("three");
var dicelib_1 = require("./dicelib");
var DieD4 = /** @class */ (function (_super) {
    __extends(DieD4, _super);
    function DieD4() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inertia = 5;
        _this.mass = 300;
        _this.range = [1, 4];
        _this.sides = 4;
        _this.af = Math.PI * 7 / 6;
        _this.chamfer = 0.96;
        _this.faceLabels = diceconsts_1.DiceConsts.D4_LABELS;
        _this.faces = [[1, 0, 2, 1], [0, 1, 3, 2], [0, 3, 2, 3], [1, 2, 3, 4]];
        _this.geometryScale = 1.2;
        _this.tab = -0.1;
        _this.vertices = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]];
        return _this;
    }
    DieD4.prototype.createTextTexture = function (text, color, backColor, size, margin) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var ts = dicelib_1.calculateTextureSize(size + margin) * 2;
        canvas.width = canvas.height = ts;
        context.font = (ts - margin) / 1.5 + 'pt Arial';
        context.fillStyle = backColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = color;
        for (var _i = 0, _a = text.split(/,/); _i < _a.length; _i++) {
            var i = _a[_i];
            context.fillText(text[i], canvas.width / 2, canvas.height / 2 - ts * 0.3);
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(Math.PI * 2 / 3);
            context.translate(-canvas.width / 2, -canvas.height / 2);
        }
        var texture = new three_1.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    };
    return DieD4;
}(die_1.Die));
exports.DieD4 = DieD4;
//# sourceMappingURL=die-d4.js.map