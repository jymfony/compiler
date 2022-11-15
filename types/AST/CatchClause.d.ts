declare module "@jymfony/compiler" {
    namespace AST {
        class CatchClause extends implementationOf(NodeInterface) {
            public location: SourceLocation;
            private _param: PatternInterface;
            private _block: BlockStatement;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, param: null | PatternInterface, block: BlockStatement): void;
            constructor(location: SourceLocation, param: null | PatternInterface, block: BlockStatement);

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
