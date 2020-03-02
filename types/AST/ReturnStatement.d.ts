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

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
