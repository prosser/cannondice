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
var DieD8 = /** @class */ (function (_super) {
    __extends(DieD8, _super);
    function DieD8() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.range = [1, 8];
        _this.mass = 340;
        _this.inertia = 10;
        _this.sides = 8;
        _this.vertices = [
            [1, 0, 0],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
            [0, 0, 1],
            [0, 0, -1]
        ];
        _this.faces = [
            [0, 2, 4, 1],
            [0, 4, 3, 2],
            [0, 3, 5, 3],
            [0, 5, 2, 4],
            [1, 3, 4, 5],
            [1, 4, 2, 6],
            [1, 2, 5, 7],
            [1, 5, 3, 8]
        ];
        _this.tab = 0;
        _this.af = -Math.PI / 4 / 2;
        _this.chamfer = 0.965;
        return _this;
    }
    return DieD8;
}(die_1.Die));
exports.DieD8 = DieD8;
//# sourceMappingURL=die-d8.js.map