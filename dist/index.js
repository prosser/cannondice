"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib = require("./dicelib");
var _ = require("lodash");
var dicenotation_1 = require("./dicenotation");
var dicebox_1 = require("./dicebox");
var dicefactory_1 = require("./dicefactory");
function dice_initialize(container, options) {
    options = options || {};
    if (!!options.loadingElement) {
        document.removeChild(options.loadingElement);
    }
    var canvas = options.canvas;
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = container.clientWidth - 1;
        canvas.height = container.clientHeight - 1;
        var firstChild = _.first(container.children);
        if (!!firstChild) {
            container.insertBefore(canvas, firstChild);
        }
        else {
            container.appendChild(canvas);
        }
    }
    var label = options.label;
    var set = options.set;
    var selectorDiv = options.selectorDiv;
    var infoDiv = options.infoDiv;
    var handleSetChange = function (ev) {
        set.style.width = set.value.length + 3 + 'ex';
    };
    handleSetChange();
    lib.useTrueRandom(false);
    lib.bind(set, 'keyup', handleSetChange);
    lib.bind(set, 'mousedown', function (ev) {
        ev.stopPropagation();
    });
    lib.bind(set, 'mouseup', function (ev) {
        ev.stopPropagation();
    });
    lib.bind(set, 'focus', function (ev) { return lib.removeCssClass(container, 'noselect'); });
    lib.bind(set, 'blur', function (ev) { return lib.removeCssClass(container, 'noselect'); });
    if (options.clearElement) {
        lib.bind(options.clearElement, ['mouseup', 'touchend'], function (ev) {
            ev.stopPropagation();
            set.value = '0';
            handleSetChange();
        });
    }
    var factory = new dicefactory_1.DiceFactory();
    var box = new dicebox_1.DiceBox(new dicefactory_1.DiceFactory(), canvas, { width: 500, height: 500 });
    box.animateSelector = false;
    lib.bind(window, 'resize', function () {
        canvas.style.width = window.innerWidth - 1 + 'px';
        canvas.style.height = window.innerHeight - 1 + 'px';
        box.reinit(canvas, { width: 500, height: 300 });
    });
    var showSelector = function () {
        infoDiv.style.display = 'none';
        selectorDiv.style.display = 'inline-block';
        box.drawSelector();
    };
    var beforeRoll = function (vectors, notation, callback) {
        infoDiv.style.display = 'none';
        selectorDiv.style.display = 'none';
        // do here rpc call or whatever to get your own result of throw.
        // then callback with array of your result, example:
        // callback([2, 2, 2, 2]); // for 4d6 where all dice values are 2.
        callback();
    };
    var notationGetter = function () { return set.value; };
    var afterRoll = function (box, notation, result) {
        var res = result.join(' ');
        if (notation.constant)
            res += ' +' + notation.constant;
        if (result.length > 1)
            res +=
                ' = ' +
                    (result.reduce(function (s, a) {
                        return s + a;
                    }) +
                        notation.constant);
        label.innerHTML = res;
        infoDiv.style.display = 'inline-block';
    };
    box.bindMouse(container, notationGetter, beforeRoll, afterRoll);
    if (options.throwElement) {
        box.bindThrow(options.throwElement, notationGetter, beforeRoll, afterRoll);
    }
    lib.bind(container, ['mouseup'], function (ev) {
        ev.stopPropagation();
        if (selectorDiv.style.display == 'none') {
            if (!box.rolling)
                showSelector();
            box.rolling = false;
            return;
        }
        var name = box.findDieAtMousePosition(ev);
        if (name !== undefined) {
            var notation = dicenotation_1.DiceNotation.parse(set.value);
            notation.set.push(name);
            set.value = notation.toString();
            handleSetChange();
        }
    });
}
exports.dice_initialize = dice_initialize;
//# sourceMappingURL=index.js.map