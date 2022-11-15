declare module "@jymfony/compiler" {
    namespace AST {
        class BreakStatement extends implementationOf(StatementInterface) {
            public location: SourceLocation;
            private _label: null | Identifier;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, label: null | Identifier): void;
            constructor(location: SourceLocation, label: null | Identifier);

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
