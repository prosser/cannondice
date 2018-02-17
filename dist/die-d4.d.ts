import { Die } from './die';
import { Texture } from 'three';
export declare class DieD4 extends Die {
    inertia: number;
    mass: number;
    range: number[];
    sides: number;
    protected af: number;
    protected chamfer: number;
    protected faceLabels: string[];
    protected faces: number[][];
    protected geometryScale: number;
    protected tab: number;
    protected vertices: number[][];
    protected createTextTexture(text: string, color: string, backColor: string, size: number, margin: number): Texture;
}
