declare module "@jymfony/compiler" {
    namespace AST {
        class SpreadElement extends implementationOf(NodeInterface) {
            public location: SourceLocation;
            private _expression: ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, expression: ExpressionInterface): void;

            constructor(location: SourceLocation, expression: ExpressionInterface);

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
