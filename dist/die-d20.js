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
var DieD20 = /** @class */ (function (_super) {
    __extends(DieD20, _super);
    function DieD20() {
        var _this = _super.call(this) || this;
        _this.inertia = 6;
        _this.mass = 400;
        _this.range = [1, 20];
        _this.sides = 20;
        _this.af = -Math.PI / 4 / 2;
        _this.chamfer = 0.955;
        _this.faces = [];
        _this.tab = -0.2;
        _this.vertices = [];
        var t = (1 + Math.sqrt(5)) / 2;
        var vertices = [
            [-1, t, 0],
            [1, t, 0],
            [-1, -t, 0],
            [1, -t, 0],
            [0, -1, t],
            [0, 1, t],
            [0, -1, -t],
            [0, 1, -t],
            [t, 0, -1],
            [t, 0, 1],
            [-t, 0, -1],
            [-t, 0, 1]
        ];
        var faces = [
            [0, 11, 5, 1],
            [0, 5, 1, 2],
            [0, 1, 7, 3],
            [0, 7, 10, 4],
            [0, 10, 11, 5],
            [1, 5, 9, 6],
            [5, 11, 4, 7],
            [11, 10, 2, 8],
            [10, 7, 6, 9],
            [7, 1, 8, 10],
            [3, 9, 4, 11],
            [3, 4, 2, 12],
            [3, 2, 6, 13],
            [3, 6, 8, 14],
            [3, 8, 9, 15],
            [4, 9, 5, 16],
            [2, 4, 11, 17],
            [6, 2, 10, 18],
            [8, 6, 7, 19],
            [9, 8, 1, 20]
        ];
        _this.vertices = vertices;
        _this.faces = faces;
        return _this;
    }
    return DieD20;
}(die_1.Die));
exports.DieD20 = DieD20;
//# sourceMappingURL=die-d20.js.map