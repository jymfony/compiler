declare class AssignmentPattern extends implementationOf(PatternInterface) {
    public location: SourceLocation;
    private _left: PatternInterface;
    private _right: ExpressionInterface;

    /**
     * @inheritdoc
     */
    public readonly names: (Identifier|ObjectMember)[];

    /**
     * Gets the left hand of the pattern.
     */
    public readonly left: PatternInterface;

    /**
     * Gets the right hand of the pattern.
     */
    public readonly right: ExpressionInterface;

    /**
     * Constructor.
     */
    __construct(location: SourceLocation, left: PatternInterface, right: ExpressionInterface): void;
    constructor(location: SourceLocation, left: PatternInterface, right: ExpressionInterface);

    /**
     * @inheritdoc
     */
    compile(compiler: Compiler): void;
}
