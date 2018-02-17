import { Die } from './die';
export declare class DieD6 extends Die {
    inertia: number;
    mass: number;
    range: number[];
    sides: 6;
    protected af: number;
    protected chamfer: number;
    protected faces: number[][];
    protected tab: number;
    protected vertices: number[][];
}
