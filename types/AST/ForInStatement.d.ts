declare module "@jymfony/compiler" {
    namespace AST {
        class ForInStatement extends implementationOf(StatementInterface) {
            public location: SourceLocation;

            private _left: VariableDeclaration | ExpressionInterface;
            private _right: ExpressionInterface;
            private _body: StatementInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, left: VariableDeclaration | ExpressionInterface, right: ExpressionInterface, body: StatementInterface): void;

            constructor(location: SourceLocation, left: VariableDeclaration | ExpressionInterface, right: ExpressionInterface, body: StatementInterface);

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
