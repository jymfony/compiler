declare module "@jymfony/compiler" {
    namespace AST {
        class Argument extends implementationOf(NodeInterface) {
            location: SourceLocation;
            private _pattern: PatternInterface | RestElement;
            private decorators: null | AppliedDecorator[];

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, pattern: PatternInterface | RestElement): void;
            constructor(location: SourceLocation, pattern: PatternInterface | RestElement);

            /**
             * Gets the argument pattern.
             */
            public readonly pattern: PatternInterface | RestElement;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
