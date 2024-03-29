declare module "@jymfony/compiler" {
    namespace AST {
        class UnaryExpression extends implementationOf(ExpressionInterface) {
            public location: SourceLocation;

            private _operator: string;
            private _argument: ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, operator: string, argument: ExpressionInterface): void;
            constructor(location: SourceLocation, operator: string, argument: ExpressionInterface);

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
