declare class Base64VLQ {
    /**
     * Returns the base 64 VLQ encoded value.
     */
    static encode(value: number): string;

    /**
     * Decodes the next base 64 VLQ value from the given string.
     */
    static decode(str: string, index: number): [number, number];
}

export = Base64VLQ;
