declare module "@jymfony/compiler" {
    namespace AST {
        class ObjectProperty extends implementationOf(ObjectMember) {
            public location: SourceLocation;
            protected _key: ExpressionInterface;
            protected _value: ExpressionInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, key: ExpressionInterface, value: ExpressionInterface): void;
            constructor(location: SourceLocation, key: ExpressionInterface, value: ExpressionInterface);

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
