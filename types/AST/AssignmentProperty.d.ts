declare module "@jymfony/compiler" {
    namespace AST {
        class AssignmentProperty extends ObjectProperty {
            public location: SourceLocation;

            /**
             * Gets the property key.
             */
            public readonly key: ExpressionInterface;

            /**
             * Gets the property value.
             */
            public readonly value: null | ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, key: ExpressionInterface, value: PatternInterface): void;
            constructor(location: SourceLocation, key: ExpressionInterface, value: PatternInterface);

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
