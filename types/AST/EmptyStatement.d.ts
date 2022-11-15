declare module "@jymfony/compiler" {
    namespace AST {
        class EmptyStatement extends implementationOf(StatementInterface) {
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
            prepare(compiler: Compiler): void;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
