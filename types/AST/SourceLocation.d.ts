declare class SourceLocation {
    /**
     * Gets the source start position.
     */
    public readonly start: Position;

    private _source: string;
    private _start: Position;
    private _end: Position;

    /**
     * Constructor.
     */
    constructor(source: string, start: Position, end: Position);
}
