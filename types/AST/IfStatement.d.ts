declare module "@jymfony/compiler" {
    namespace AST {
        class IfStatement extends implementationOf(StatementInterface) {
            public location: SourceLocation;
            private _test: ExpressionInterface;
            private _consequent: StatementInterface;
            private _alternate: null | StatementInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, test: ExpressionInterface, consequent: StatementInterface, alternate?: null | StatementInterface): void;
            constructor(location: SourceLocation, test: ExpressionInterface, consequent: StatementInterface, alternate?: null | StatementInterface);

            public readonly shouldBeClosed: boolean;

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
