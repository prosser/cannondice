import { DieD4 } from './die-d4';
import { DieD6 } from './die-d6';
import { DieD8 } from './die-d8';
import { DieD10 } from './die-d10';
import { DieD12 } from './die-d12';
import { DieD20 } from './die-d20';
export declare class DiceFactory {
    constructor();
    createDie(sides: number): DieD4 | DieD6 | DieD8 | DieD10 | DieD12 | DieD20;
    getStatic(sides: number): typeof DieD4 | typeof DieD6 | typeof DieD8 | typeof DieD10 | typeof DieD12 | typeof DieD20;
}
