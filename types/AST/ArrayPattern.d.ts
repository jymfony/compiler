declare module "@jymfony/compiler" {
    namespace AST {
        class ArrayPattern extends implementationOf(PatternInterface) {
            public location: SourceLocation;
            private _elements: PatternInterface[];

            /**
             * @inheritdoc
             */
            public readonly names: (Identifier | ObjectMember)[];

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, elements: PatternInterface[]): void;

            constructor(location: SourceLocation, elements: PatternInterface[]);

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
