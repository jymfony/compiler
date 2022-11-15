declare module "@jymfony/compiler" {
    namespace AST {
        class RestElement extends implementationOf(PatternInterface) {
            public location: SourceLocation;
            private _argument: PatternInterface;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, argument: PatternInterface): void;
            constructor(location: SourceLocation, argument: PatternInterface);

            /**
             * @inheritdoc
             */
            prepare(compiler: Compiler): void;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;

            /**
             * The rest argument.
             */
            public readonly argument: PatternInterface;
        }
    }
}
