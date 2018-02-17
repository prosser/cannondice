"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DiceNotation = /** @class */ (function () {
    function DiceNotation() {
        this.set = [];
        this.constant = 0;
        this.result = [];
        this.error = false;
    }
    DiceNotation.parse = function (value) {
        var no = value.split('@');
        var dr0 = /\s*(\d*)([a-z]+)(\d+)(\s*\+\s*(\d+)){0,1}\s*(\+|$)/gi;
        var dr1 = /(\b)*(\d+)(\b)*/gi;
        var res;
        var notation = new DiceNotation();
        while ((res = dr0.exec(no[0]))) {
            var command = res[2];
            if (command != 'd') {
                notation.error = true;
                continue;
            }
            var count = res[1] === '' ? 1 : parseInt(res[1]);
            var sides = parseInt(res[3]);
            if ([4, 6, 8, 10, 12, 20, 100].indexOf(sides) === -1) {
                notation.error = true;
                continue;
            }
            while (count--) {
                notation.set.push(sides);
            }
            if (res[5]) {
                notation.constant += parseInt(res[5]);
            }
        }
        while ((res = dr1.exec(no[1]))) {
            notation.result.push(parseInt(res[2]));
        }
        return notation;
    };
    DiceNotation.prototype.toString = function () {
        var dict = {};
        var result = '';
        for (var i in this.set)
            if (!dict[this.set[i]])
                dict[this.set[i]] = 1;
            else
                ++dict[this.set[i]];
        for (var i in dict) {
            if (result.length)
                result += ' + ';
            result += (dict[i] > 1 ? dict[i] : '') + i;
        }
        if (this.constant)
            result += ' + ' + this.constant;
        return result;
    };
    return DiceNotation;
}());
exports.DiceNotation = DiceNotation;
//# sourceMappingURL=dicenotation.js.map