declare module "@jymfony/compiler" {
    namespace AST {
        class BinaryExpression extends implementationOf(ExpressionInterface) {
            public location: SourceLocation;
            private _operator: string;
            private _left: ExpressionInterface;
            private _right: ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, operator: string, left: ExpressionInterface, right: ExpressionInterface): void;
            constructor(location: SourceLocation, operator: string, left: ExpressionInterface, right: ExpressionInterface);

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
