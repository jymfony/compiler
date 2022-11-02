declare module "@jymfony/compiler" {
    namespace AST {
        class AppliedDecorator extends implementationOf(NodeInterface) {
            public location: SourceLocation;
            private _expression: ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, decorator: DecoratorDescriptor, args: ExpressionInterface[]): void;
            constructor(location: SourceLocation, decorator: DecoratorDescriptor, args: ExpressionInterface[]);

            /**
             * Gets the decorator descriptor.
             */
            public readonly decorator: DecoratorDescriptor;

            /**
             * Gets the decorator expression.
             */
            public readonly expression: ExpressionInterface;

            /**
             * Compiles a decorator.
             */
            compile(compiler: Compiler, class_: Class, target: Class | ClassMemberInterface | Argument, parameterIndex?: number): StatementInterface[];
        }
    }
}
