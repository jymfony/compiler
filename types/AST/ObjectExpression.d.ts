declare module "@jymfony/compiler" {
    namespace AST {
        class ObjectExpression extends implementationOf(ExpressionInterface) {
            public location: SourceLocation;
            private _properties: ObjectMember[];

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, properties: ObjectMember[]): void;

            constructor(location: SourceLocation, properties: ObjectMember[]);

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
