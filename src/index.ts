import * as lib from './dicelib';
import * as _ from 'lodash';
import { DiceNotation } from './dicenotation';
import { DiceBox } from './dicebox';
import { DiceOptions } from './diceoptions';
import { DiceFactory } from './dicefactory';

export function dice_initialize(container: HTMLElement, options?: DiceOptions) {
  options = options || {};
  if (!!options.loadingElement) {
    document.removeChild(options.loadingElement);
  }

  let canvas = options.canvas;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = container.clientWidth - 1;
    canvas.height = container.clientHeight - 1;

    const firstChild = _.first(container.children);
    if (!!firstChild) {
      container.insertBefore(canvas, firstChild);
    } else {
      container.appendChild(canvas);
    }
  }

  let label = options.label;
  let set = options.set;
  let selectorDiv = options.selectorDiv;
  let infoDiv = options.infoDiv;

  let handleSetChange = (ev?: Event) => {
    set.style.width = set.value.length + 3 + 'ex';
  };
  handleSetChange();

  lib.useTrueRandom(false);

  lib.bind(set, 'keyup', handleSetChange);
  lib.bind(set, 'mousedown', (ev: MouseEvent) => {
    ev.stopPropagation();
  });
  lib.bind(set, 'mouseup', (ev: MouseEvent) => {
    ev.stopPropagation();
  });
  lib.bind(set, 'focus', (ev: Event) => lib.removeCssClass(container, 'noselect'));
  lib.bind(set, 'blur', (ev: Event) => lib.removeCssClass(container, 'noselect'));

  if (options.clearElement) {
    lib.bind(options.clearElement, ['mouseup', 'touchend'], function(ev) {
      ev.stopPropagation();
      set.value = '0';
      handleSetChange();
    });
  }

  let factory = new DiceFactory();
  var box = new DiceBox(new DiceFactory(), canvas, <ClientRect>{ width: 500, height: 500 });
  box.animateSelector = false;

  lib.bind(window, 'resize', ()  => {
    canvas.style.width = window.innerWidth - 1 + 'px';
    canvas.style.height = window.innerHeight - 1 + 'px';
    box.reinit(canvas, <ClientRect>{ width: 500, height: 300 });
  });

  let showSelector = () => {
    infoDiv.style.display = 'none';
    selectorDiv.style.display = 'inline-block';
    box.drawSelector();
  };

  let beforeRoll = (vectors, notation, callback) => {
    infoDiv.style.display = 'none';
    selectorDiv.style.display = 'none';
    // do here rpc call or whatever to get your own result of throw.
    // then callback with array of your result, example:
    // callback([2, 2, 2, 2]); // for 4d6 where all dice values are 2.
    callback();
  }

  let notationGetter = () => set.value;

  let afterRoll = (box: DiceBox, notation: DiceNotation, result: number[]): void => {
    var res = result.join(' ');
    if (notation.constant) res += ' +' + notation.constant;
    if (result.length > 1)
      res +=
        ' = ' +
        (result.reduce(function(s, a) {
          return s + a;
        }) +
          notation.constant);
    label.innerHTML = res;
    infoDiv.style.display = 'inline-block';
  }

  box.bindMouse(container, notationGetter, beforeRoll, afterRoll);

  if (options.throwElement) {
    box.bindThrow(options.throwElement, notationGetter, beforeRoll, afterRoll);
  }

  lib.bind(container, ['mouseup'], (ev:MouseEvent) => {
    ev.stopPropagation();
    if (selectorDiv.style.display == 'none') {
      if (!box.rolling) showSelector();
      box.rolling = false;
      return;
    }
    var name = box.findDieAtMousePosition(ev);
    if (name !== undefined) {
      let notation =  DiceNotation.parse(set.value);
      notation.set.push(name);
      set.value = notation.toString();
      handleSetChange();
    }
  });
}
