declare module "@jymfony/compiler" {
    namespace AST {
        class DoWhileStatement extends implementationOf(StatementInterface) {
            public location: SourceLocation;
            private _test: ExpressionInterface;
            private _body: StatementInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, test: ExpressionInterface, body: StatementInterface): void;
            constructor(location: SourceLocation, test: ExpressionInterface, body: StatementInterface);

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
