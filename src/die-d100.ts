import { Die } from './die';
import { DieD10 } from './die-d10';
import { DiceConsts } from './diceconsts';

export class DieD100 extends DieD10 {
  sides = 100;

  protected faceLabels = DiceConsts.BY_TEN_LABELS;
  protected margin = 1.5;
}
