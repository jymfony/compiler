declare module "@jymfony/compiler" {
    namespace AST {
        class LabeledStatement extends implementationOf(StatementInterface) {
            public location: SourceLocation;

            private _label: Identifier;
            private _statement: StatementInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, label: Identifier, statement: StatementInterface): void;
            constructor(location: SourceLocation, label: Identifier, statement: StatementInterface);

            public readonly shouldBeClosed: boolean;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
