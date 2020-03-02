declare class Position {
    private _line: number;
    private _column: number;

    /**
     * Gets the line number (>= 1).
     */
    public readonly line: number;

    /**
     * Gets the column number (>= 0)
     */
    public readonly column: number;

    /**
     * Constructor.
     */
    constructor(line: number, column: number);
}
