declare class Argument extends implementationOf(NodeInterface) {
    location: SourceLocation;
    private _pattern: PatternInterface | RestElement;
    private decorators: null | AppliedDecorator[];

    /**
     * Constructor.
     */
    constructor(location: SourceLocation, pattern: PatternInterface | RestElement);
    __construct(location: SourceLocation, pattern: PatternInterface | RestElement): void;

    /**
     * Gets the argument pattern.
     */
    public readonly pattern: PatternInterface | RestElement;

    /**
     * @inheritdoc
     */
    compile(compiler: Compiler);
}
