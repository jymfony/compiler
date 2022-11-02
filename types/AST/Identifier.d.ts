declare module "@jymfony/compiler" {
    namespace AST {
        class Identifier extends implementationOf(NodeInterface, ExpressionInterface, PatternInterface) {
            public location: SourceLocation;
            public docblock: string | null;
            private _name: string;

            /**
             * Gets the identifier name.
             */
            public readonly name: string;

            /**
             * @inheritdoc
             */
            public readonly names: (Identifier | ObjectMember)[];

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, name: string): void;
            constructor(location: SourceLocation, name: string);

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
