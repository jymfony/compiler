declare module "@jymfony/compiler" {
    namespace AST {
        class YieldExpression extends implementationOf(ExpressionInterface) {
            public location: SourceLocation;

            private _argument: ExpressionInterface;
            private _delegate: boolean;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, argument: ExpressionInterface, delegate: boolean): void;
            constructor(location: SourceLocation, argument: ExpressionInterface, delegate: boolean);

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
