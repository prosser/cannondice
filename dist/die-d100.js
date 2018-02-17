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
var die_d10_1 = require("./die-d10");
var diceconsts_1 = require("./diceconsts");
var DieD100 = /** @class */ (function (_super) {
    __extends(DieD100, _super);
    function DieD100() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sides = 100;
        _this.faceLabels = diceconsts_1.DiceConsts.BY_TEN_LABELS;
        _this.margin = 1.5;
        return _this;
    }
    return DieD100;
}(die_d10_1.DieD10));
exports.DieD100 = DieD100;
//# sourceMappingURL=die-d100.js.map