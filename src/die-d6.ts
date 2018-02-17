import { Die } from './die';

export class DieD6 extends Die {
  inertia = 13;
  mass = 300;
  range = [1, 6];
  sides: 6;

  protected af = Math.PI / 4;
  protected chamfer = 0.96;
  protected faces = [
    [0, 3, 2, 1, 1],
    [1, 2, 6, 5, 2],
    [0, 1, 5, 4, 3],
    [3, 7, 6, 2, 4],
    [0, 4, 7, 3, 5],
    [4, 5, 6, 7, 6]
  ];
  protected tab = 0.1;
  protected vertices = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1]
  ];
}
