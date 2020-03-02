declare class RegExpLiteral extends Literal {
    private _value: string;

    /**
     * Constructor.
     */
    // @ts-ignore
    __construct(location: SourceLocation, value: string): void;
    constructor(location: SourceLocation, value: string);

    /**
     * @inheritdoc
     */
    compile(compiler: Compiler): void;
}
