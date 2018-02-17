import { Die } from './die';
export declare class DieD12 extends Die {
    inertia: number;
    mass: number;
    range: number[];
    sides: number;
    protected af: number;
    protected chamfer: number;
    protected faces: any[];
    protected tab: number;
    protected vertices: any[];
    constructor();
}
