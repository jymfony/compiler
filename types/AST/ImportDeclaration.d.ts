declare class ImportDeclaration extends implementationOf(ModuleDeclarationInterface) {
    public location: SourceLocation;

    private _specifiers: ImportSpecifierInterface[];
    private _source: Literal;

    /**
     * Constructor.
     */
    __construct(location: SourceLocation, specifiers: ImportSpecifierInterface[], source: Literal): void;
    constructor(location: SourceLocation, specifiers: ImportSpecifierInterface[], source: Literal);

    /**
     * @inheritdoc
     */
    compile(compiler: Compiler): void;
}
