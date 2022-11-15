declare module "@jymfony/compiler" {
    namespace AST {
        class AssignmentExpression extends implementationOf(PatternInterface) {
            public location: SourceLocation;
            private _operator: string;
            private _left: PatternInterface | ExpressionInterface;
            private _right: ExpressionInterface;

            /**
             * Gets the assignment operator.
             */
            public readonly operator: string;

            /**
             * Gets the left hand of the expression.
             */
            public readonly left: PatternInterface | ExpressionInterface;

            /**
             * Gets the right hand of the expression.
             */
            public readonly right: ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, operator: string, left: PatternInterface | ExpressionInterface, right: ExpressionInterface): void;
            constructor(location: SourceLocation, operator: string, left: PatternInterface | ExpressionInterface, right: ExpressionInterface);

            /**
             * @inheritdoc
             */
            prepare(compiler: Compiler): void;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void
        }
    }
}
