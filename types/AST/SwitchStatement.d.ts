declare module "@jymfony/compiler" {
    namespace AST {
        class SwitchStatement extends implementationOf(StatementInterface) {
            public location: SourceLocation;

            private _discriminant: ExpressionInterface;
            private _cases: SwitchCase[];

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, discriminant: ExpressionInterface, cases: SwitchCase[]): void;
            constructor(location: SourceLocation, discriminant: ExpressionInterface, cases: SwitchCase[]);

            public readonly shouldBeClosed: boolean;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
