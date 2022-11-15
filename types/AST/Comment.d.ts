declare module "@jymfony/compiler" {
    namespace AST {
        class Comment extends implementationOf(NodeInterface) {
            public location: SourceLocation;
            private _value: string;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, value: string): void;
            constructor(location: SourceLocation, value: string);

            /**
             * Gets the comment content.
             */
            public readonly value: string;

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
