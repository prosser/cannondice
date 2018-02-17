export declare class DiceNotation {
    set: number[];
    constant: number;
    result: number[];
    error: boolean;
    static parse(value: string): DiceNotation;
    toString(): string;
}
