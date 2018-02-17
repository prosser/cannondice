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
var DieD12 = /** @class */ (function (_super) {
    __extends(DieD12, _super);
    function DieD12() {
        var _this = _super.call(this) || this;
        _this.inertia = 8;
        _this.mass = 350;
        _this.range = [1, 12];
        _this.sides = 12;
        _this.af = Math.PI / 4 / 2;
        _this.chamfer = 0.968;
        _this.faces = [];
        _this.tab = 0.2;
        _this.vertices = [];
        var p = (1 + Math.sqrt(5)) / 2, q = 1 / p;
        var vertices = [
            [0, q, p],
            [0, q, -p],
            [0, -q, p],
            [0, -q, -p],
            [p, 0, q],
            [p, 0, -q],
            [-p, 0, q],
            [-p, 0, -q],
            [q, p, 0],
            [q, -p, 0],
            [-q, p, 0],
            [-q, -p, 0],
            [1, 1, 1],
            [1, 1, -1],
            [1, -1, 1],
            [1, -1, -1],
            [-1, 1, 1],
            [-1, 1, -1],
            [-1, -1, 1],
            [-1, -1, -1]
        ];
        var faces = [
            [2, 14, 4, 12, 0, 1],
            [15, 9, 11, 19, 3, 2],
            [16, 10, 17, 7, 6, 3],
            [6, 7, 19, 11, 18, 4],
            [6, 18, 2, 0, 16, 5],
            [18, 11, 9, 14, 2, 6],
            [1, 17, 10, 8, 13, 7],
            [1, 13, 5, 15, 3, 8],
            [13, 8, 12, 4, 5, 9],
            [5, 4, 14, 9, 15, 10],
            [0, 12, 8, 10, 16, 11],
            [3, 19, 7, 17, 1, 12]
        ];
        _this.vertices = vertices;
        _this.faces = faces;
        return _this;
    }
    return DieD12;
}(die_1.Die));
exports.DieD12 = DieD12;
//# sourceMappingURL=die-d12.js.map