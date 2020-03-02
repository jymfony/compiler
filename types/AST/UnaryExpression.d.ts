declare class UnaryExpression extends implementationOf(ExpressionInterface) {
    public location: SourceLocation;

    private _operator: string;
    private _argument: ExpressionInterface;

    /**
     * Constructor.
     */
    __construct(location: SourceLocation, operator: string, argument: ExpressionInterface): void;
    constructor(location: SourceLocation, operator: string, argument: ExpressionInterface);

    /**
     * @inheritdoc
     */
    compile(compiler: Compiler): void;
}
