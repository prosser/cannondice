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
var DieD6 = /** @class */ (function (_super) {
    __extends(DieD6, _super);
    function DieD6() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inertia = 13;
        _this.mass = 300;
        _this.range = [1, 6];
        _this.af = Math.PI / 4;
        _this.chamfer = 0.96;
        _this.faces = [
            [0, 3, 2, 1, 1],
            [1, 2, 6, 5, 2],
            [0, 1, 5, 4, 3],
            [3, 7, 6, 2, 4],
            [0, 4, 7, 3, 5],
            [4, 5, 6, 7, 6]
        ];
        _this.tab = 0.1;
        _this.vertices = [
            [-1, -1, -1],
            [1, -1, -1],
            [1, 1, -1],
            [-1, 1, -1],
            [-1, -1, 1],
            [1, -1, 1],
            [1, 1, 1],
            [-1, 1, 1]
        ];
        return _this;
    }
    return DieD6;
}(die_1.Die));
exports.DieD6 = DieD6;
//# sourceMappingURL=die-d6.js.map