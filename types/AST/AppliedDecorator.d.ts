declare module "@jymfony/compiler" {
    namespace AST {
        class AppliedDecorator extends implementationOf(NodeInterface) {
            public location: SourceLocation;
            private _expression: ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, expression: ExpressionInterface): void;
            constructor(location: SourceLocation, expression: ExpressionInterface);

            /**
             * Gets the decorator expression.
             */
            public readonly expression: ExpressionInterface;

            /**
             * @inheritdoc
             */
            prepare(compiler: Compiler): void;

            /**
             * Compiles a decorator.
             */
            compile(compiler: Compiler, class_: Class, target: Class | ClassMemberInterface | Argument, parameterIndex?: number): StatementInterface[];
        }
    }
}
