declare module "@jymfony/compiler" {
    namespace AST {
        class ForOfStatement extends ForInStatement {
            private _await: boolean;

            /**
             * Constructor.
             */
            // @ts-ignore
            __construct(location: SourceLocation, left: VariableDeclaration | ExpressionInterface, right: ExpressionInterface, body: StatementInterface, _await: boolean): void;

            constructor(location: SourceLocation, left: VariableDeclaration | ExpressionInterface, right: ExpressionInterface, body: StatementInterface, _await: boolean);

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
