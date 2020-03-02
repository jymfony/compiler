declare module "@jymfony/compiler" {
    namespace AST {
        class SwitchCase extends implementationOf(NodeInterface) {
            public location: SourceLocation;
            private _test: ExpressionInterface;
            private _consequent: StatementInterface[];

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, test: null | ExpressionInterface, consequent: StatementInterface[]): void;

            constructor(location: SourceLocation, test: null | ExpressionInterface, consequent: StatementInterface[]);

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
