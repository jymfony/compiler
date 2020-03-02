declare class CatchClause extends implementationOf(NodeInterface) {
    public location: SourceLocation;
    private _param: PatternInterface;
    private _block: BlockStatement;

    /**
     * Constructor.
     */
    __construct(location: SourceLocation, param: null | PatternInterface, block: BlockStatement): void;
    constructor(location: SourceLocation, param: null | PatternInterface, block: BlockStatement);

    /**
     * @inheritdoc
     */
    compile(compiler: Compiler): void;
}
