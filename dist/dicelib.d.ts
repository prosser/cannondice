import { Vector2 } from 'three';
export declare function useTrueRandom(value: boolean): void;
export declare function initRng(callback?: () => any): void;
export declare function removeCssClass(el: HTMLElement, className: string): void;
export declare function addCssClass(el: HTMLElement, className: string): void;
export declare function bind(sel: EventTarget, eventName: string | string[], func: EventListenerOrEventListenerObject, bubble?: boolean | AddEventListenerOptions): void;
export declare function unbind(sel: EventTarget, eventName: string | string[], func: EventListenerOrEventListenerObject, bubble?: boolean | AddEventListenerOptions): void;
export declare function rng(): number;
export declare function copyto(obj: any, res: any): any;
export interface GeometryWithCannnonShape extends THREE.Geometry {
    cannonShape?: CANNON.Shape;
}
export declare function createDiceGeometry(vertices: number[][], faces: number[][], radius: number, tab: number, af: number, chamfer: number): GeometryWithCannnonShape;
export declare function calculateTextureSize(approx: number): number;
export declare function randomizeVector(vector: Vector2): Vector2;
