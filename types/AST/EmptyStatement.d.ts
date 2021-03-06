declare module "@jymfony/compiler" {
    namespace AST {
        class EmptyStatement extends implementationOf(StatementInterface) {
            public location: SourceLocation;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation): void;

            constructor(location: SourceLocation);

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
