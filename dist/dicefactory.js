"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var die_d4_1 = require("./die-d4");
var die_d6_1 = require("./die-d6");
var die_d8_1 = require("./die-d8");
var die_d10_1 = require("./die-d10");
var die_d12_1 = require("./die-d12");
var die_d20_1 = require("./die-d20");
var die_d100_1 = require("./die-d100");
var DiceFactory = /** @class */ (function () {
    function DiceFactory() {
    }
    DiceFactory.prototype.createDie = function (sides) {
        switch (sides) {
            case 4:
                return new die_d4_1.DieD4();
            case 6:
                return new die_d6_1.DieD6();
            case 8:
                return new die_d8_1.DieD8();
            case 10:
                return new die_d10_1.DieD10();
            case 12:
                return new die_d12_1.DieD12();
            case 20:
                return new die_d20_1.DieD20();
            case 100:
                return new die_d100_1.DieD100();
            default:
                throw new Error("Don't know how to make a die with " + sides + " sides, sorry.");
        }
    };
    DiceFactory.prototype.getStatic = function (sides) {
        switch (sides) {
            case 4:
                return die_d4_1.DieD4;
            case 6:
                return die_d6_1.DieD6;
            case 8:
                return die_d8_1.DieD8;
            case 10:
                return die_d10_1.DieD10;
            case 12:
                return die_d12_1.DieD12;
            case 20:
                return die_d20_1.DieD20;
            case 100:
                return die_d100_1.DieD100;
            default:
                throw new Error("Don't know how to make a die with " + sides + " sides, sorry.");
        }
    };
    return DiceFactory;
}());
exports.DiceFactory = DiceFactory;
//# sourceMappingURL=dicefactory.js.map