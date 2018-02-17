import { Die } from './die';

export class DieD8 extends Die {
  range = [1, 8];
  mass = 340;
  inertia = 10;
  sides = 8;

  protected vertices = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1]
  ];
  protected faces = [
    [0, 2, 4, 1],
    [0, 4, 3, 2],
    [0, 3, 5, 3],
    [0, 5, 2, 4],
    [1, 3, 4, 5],
    [1, 4, 2, 6],
    [1, 2, 5, 7],
    [1, 5, 3, 8]
  ];
  protected tab = 0;
  protected af = -Math.PI / 4 / 2;
  protected chamfer = 0.965;
  protected margin: 1.2;
}
