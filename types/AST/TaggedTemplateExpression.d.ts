declare module "@jymfony/compiler" {
    namespace AST {
        class TaggedTemplateExpression extends implementationOf(ExpressionInterface) {
            public location: SourceLocation;

            private _tag: ExpressionInterface;
            private _template: StringLiteral;

            /**
             * Gets the tag expression.
             */
            public readonly tag: ExpressionInterface;

            /**
             * Gets the template string.
             */
            public readonly template: StringLiteral;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, tag: ExpressionInterface, template: StringLiteral): void;
            constructor(location: SourceLocation, tag: ExpressionInterface, template: StringLiteral);

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
