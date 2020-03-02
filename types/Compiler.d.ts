declare class Compiler {
    public readonly code: string;

    private _code: string;
    private _locations: SourceLocation[];
    private _sourceMapGenerator: Generator;
    private _line: number;
    private _column: number;
    private _variableCount: number;

    /**
     * Constructor.
     */
    constructor(sourceMapGenerator: Generator);

    /**
     * Compiles a source node.
     */
    compileNode(node: NodeInterface): void;

    /**
     * Sets the original source location.
     */
    pushLocation(node: NodeInterface): void;

    /**
     * Pops out the latest source location.
     */
    popLocation(): void;

    compile(program: Program): string;

    /**
     * Emits a code string.
     */
    _emit(code: string);

    /**
     * @internal
     */
    generateVariableName(): string;
}
