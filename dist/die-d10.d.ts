import { Die } from './die';
export declare class DieD10 extends Die {
    range: number[];
    mass: number;
    inertia: number;
    sides: number;
    protected vertices: any[];
    protected faces: any[];
    protected tab: number;
    protected af: number;
    protected chamfer: number;
    constructor();
}
