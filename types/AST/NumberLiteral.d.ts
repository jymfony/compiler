declare class NumberLiteral extends Literal {
    private _value: number;

    /**
     * Constructor.
     */
    // @ts-ignore
    __construct(location: SourceLocation, value: number): void;
    constructor(location: SourceLocation, value: number);

    /**
     * @inheritdoc
     */
    compile(compiler: Compiler): void;
}
