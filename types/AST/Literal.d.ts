declare class Literal extends implementationOf(ExpressionInterface) {
    public location: SourceLocation;

    /**
     * Constructor.
     */
    __construct(location: SourceLocation): void;
    constructor(location: SourceLocation);
}
