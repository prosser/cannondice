import { Die } from './die';
import { DiceConsts } from './diceconsts';
import { Mesh, MeshFaceMaterial, Texture, Vector3 } from 'three';
import {
  calculateTextureSize,
  createDiceGeometry,
  GeometryWithCannnonShape
} from './dicelib';

export class DieD4 extends Die {
  inertia = 5;
  mass = 300;
  range = [1, 4];
  sides = 4;

  protected af = Math.PI * 7 / 6;
  protected chamfer = 0.96;
  protected faceLabels = DiceConsts.D4_LABELS;
  protected faces = [[1, 0, 2, 1], [0, 1, 3, 2], [0, 3, 2, 3], [1, 2, 3, 4]];
  protected geometryScale = 1.2;
  protected tab = -0.1;
  protected vertices = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]];

  protected createTextTexture(
    text: string,
    color: string,
    backColor: string,
    size: number,
    margin: number
  ) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let ts = calculateTextureSize(size + margin) * 2;

    canvas.width = canvas.height = ts;

    context.font = (ts - margin) / 1.5 + 'pt Arial';
    context.fillStyle = backColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = color;

    for (let i of text.split(/,/)) {
      context.fillText(text[i], canvas.width / 2, canvas.height / 2 - ts * 0.3);
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(Math.PI * 2 / 3);
      context.translate(-canvas.width / 2, -canvas.height / 2);
    }

    let texture = new Texture(canvas);
    texture.needsUpdate = true;

    return texture;
  }
}
