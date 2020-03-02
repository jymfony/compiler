declare class UpdateExpression extends implementationOf(ExpressionInterface) {
    public location: SourceLocation;

    private _operator: string;
    private _argument: ExpressionInterface;
    private _prefix: boolean;

    /**
     * Constructor.
     */
    __construct(location: SourceLocation, operator: string, argument: ExpressionInterface, prefix: boolean): void;
    constructor(location: SourceLocation, operator: string, argument: ExpressionInterface, prefix: boolean);

    /**
     * @inheritdoc
     */
    compile(compiler: Compiler): void;
}
