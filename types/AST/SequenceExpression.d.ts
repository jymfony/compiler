declare module "@jymfony/compiler" {
    namespace AST {
        class SequenceExpression extends implementationOf(ExpressionInterface) {
            public location: SourceLocation;
            private _expressions: ExpressionInterface[];

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, expressions: ExpressionInterface[]): void;
            constructor(location: SourceLocation, expressions: ExpressionInterface[]);

            /**
             * Gets the expressions.
             */
            public readonly expressions: ExpressionInterface[];

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
