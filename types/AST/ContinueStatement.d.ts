declare module "@jymfony/compiler" {
    namespace AST {
        class ContinueStatement extends implementationOf(StatementInterface) {
            public location: SourceLocation;
            private _label: null | Identifier;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, label: null | Identifier): void;
            constructor(location: SourceLocation, label: null | Identifier);

            public readonly shouldBeClosed: boolean;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
