/// <reference types="cannon" />
import { Body, Material } from 'cannon';
import { GeometryWithCannnonShape } from './dicelib';
import { Mesh, MeshFaceMaterial, Object3D, Texture } from 'three';
export declare abstract class Die extends Object3D {
    static diceBodyMaterial: Material;
    castShadow: boolean;
    diceColor: string;
    labelColor: string;
    stopped: number | boolean;
    readonly body: Body;
    readonly threeQuaternion: THREE.Quaternion;
    static readonly range: number;
    static readonly mass: number;
    static readonly inertia: number;
    static readonly sides: number;
    readonly range: number[];
    readonly mass: number;
    readonly inertia: number;
    readonly sides: number;
    geometry: GeometryWithCannnonShape;
    protected material: MeshFaceMaterial;
    private materialOptions;
    protected geometryScale: number;
    protected faceLabels: string[];
    protected margin: number;
    protected readonly abstract vertices: number[][];
    protected readonly abstract faces: number[][];
    protected readonly abstract tab: number;
    protected readonly abstract af: number;
    protected readonly abstract chamfer: number;
    private _body;
    readonly value: number;
    protected createGeometry(radius: number): GeometryWithCannnonShape;
    protected createMaterials(size: number): any[];
    protected createMesh(): Mesh;
    protected createTextTexture(text: string, color: string, backColor: string, size: number, margin: number): Texture;
}
