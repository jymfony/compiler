declare module "@jymfony/compiler" {
    namespace AST {
        class ExportAllDeclaration extends implementationOf(ModuleDeclarationInterface) {
            public location: SourceLocation;
            private _source: Literal;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, source: Literal): void;
            constructor(location: SourceLocation, source: Literal);

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
