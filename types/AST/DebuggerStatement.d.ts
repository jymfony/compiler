declare module "@jymfony/compiler" {
    namespace AST {
        class DebuggerStatement extends implementationOf(StatementInterface) {
            public location: SourceLocation;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation): void;
            constructor(location: SourceLocation);

            public readonly shouldBeClosed: boolean;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
