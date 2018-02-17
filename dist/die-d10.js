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
var DieD10 = /** @class */ (function (_super) {
    __extends(DieD10, _super);
    function DieD10() {
        var _this = _super.call(this) || this;
        _this.range = [0, 9];
        _this.mass = 350;
        _this.inertia = 9;
        _this.sides = 10;
        _this.vertices = [];
        _this.faces = [];
        _this.tab = 0;
        _this.af = Math.PI / 6 / 5;
        _this.chamfer = 0.945;
        var a = Math.PI * 2 / 10, k = Math.cos(a), h = 0.105, v = -1;
        var vertices = [];
        for (var i = 0, b = 0; i < 10; ++i, b += a) {
            vertices.push([Math.cos(b), Math.sin(b), h * (i % 2 ? 1 : -1)]);
        }
        vertices.push([0, 0, -1]);
        vertices.push([0, 0, 1]);
        var faces = [
            [5, 7, 11, 0],
            [4, 2, 10, 1],
            [1, 3, 11, 2],
            [0, 8, 10, 3],
            [7, 9, 11, 4],
            [8, 6, 10, 5],
            [9, 1, 11, 6],
            [2, 0, 10, 7],
            [3, 5, 11, 8],
            [6, 4, 10, 9],
            [1, 0, 2, v],
            [1, 2, 3, v],
            [3, 2, 4, v],
            [3, 4, 5, v],
            [5, 4, 6, v],
            [5, 6, 7, v],
            [7, 6, 8, v],
            [7, 8, 9, v],
            [9, 8, 0, v],
            [9, 0, 1, v]
        ];
        _this.vertices = vertices;
        _this.faces = faces;
        return _this;
    }
    return DieD10;
}(die_1.Die));
exports.DieD10 = DieD10;
//# sourceMappingURL=die-d10.js.map