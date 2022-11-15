declare module "@jymfony/compiler" {
    namespace AST {
        class ReturnStatement extends implementationOf(StatementInterface) {
            public location: SourceLocation;
            private _argument: ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, argument?: null | ExpressionInterface): void;
            constructor(location: SourceLocation, argument?: null | ExpressionInterface);

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
