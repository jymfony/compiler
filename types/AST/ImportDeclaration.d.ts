declare module "@jymfony/compiler" {
    namespace AST {
        class ImportDeclaration extends implementationOf(ModuleDeclarationInterface) {
            public location: SourceLocation;

            private _specifiers: ImportSpecifierInterface[];
            private _source: Literal;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, specifiers: ImportSpecifierInterface[], source: Literal): void;
            constructor(location: SourceLocation, specifiers: ImportSpecifierInterface[], source: Literal);

            public readonly shouldBeClosed: boolean;

            /**
             * @inheritdoc
             */
            prepare(compiler: Compiler): void;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
