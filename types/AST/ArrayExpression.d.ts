declare module "@jymfony/compiler" {
    namespace AST {
        class ArrayExpression extends implementationOf(ExpressionInterface) {
            public location: SourceLocation;
            private _elements: (ExpressionInterface | SpreadElement)[];

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, elements: (ExpressionInterface | SpreadElement)[]): void;
            constructor(location: SourceLocation, elements: (ExpressionInterface | SpreadElement)[]);

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
