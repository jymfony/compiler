declare module "@jymfony/compiler" {
    namespace AST {
        class ParenthesizedExpression extends implementationOf(ExpressionInterface) {
            public location: SourceLocation;
            private _expression: ExpressionInterface;

            /**
             * Gets the expression inside the parenthesis.
             */
            public readonly expression: ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, expression: ExpressionInterface): void;
            constructor(location: SourceLocation, expression: ExpressionInterface);

            prepare(compiler: Compiler): void;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
