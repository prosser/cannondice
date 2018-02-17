import { Die } from './die';
export declare class DieD8 extends Die {
    range: number[];
    mass: number;
    inertia: number;
    sides: number;
    protected vertices: number[][];
    protected faces: number[][];
    protected tab: number;
    protected af: number;
    protected chamfer: number;
    protected margin: 1.2;
}
