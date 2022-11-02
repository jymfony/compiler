declare module "@jymfony/compiler" {
    namespace AST {
        class ExportDefaultDeclaration extends implementationOf(ModuleDeclarationInterface) {
            public location: SourceLocation;
            public docblock: null | string;
            public decorators: null | AppliedDecorator[];
            private _expression: ExpressionInterface;

            /**
             * Gets the expression to be default exported.
             */
            public readonly expression: ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, expression: ExpressionInterface): void;
            constructor(location: SourceLocation, expression: ExpressionInterface);

            public readonly shouldBeClosed: boolean;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
