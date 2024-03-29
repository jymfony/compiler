declare module "@jymfony/compiler" {
    namespace AST {
        class Program extends implementationOf(NodeInterface) {
            public location: SourceLocation;
            public esModule: boolean;

            /**
             * Gets the nodes array.
             */
            public readonly body: NodeInterface[];

            private _body: NodeInterface[];
            private _prepared: boolean;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation): void;
            constructor(location: SourceLocation);

            /**
             * Adds a node.
             */
            add(node: NodeInterface): void;

            /**
             * Add source mappings from previous compilation step to current program.
             */
            addSourceMappings(...mappings: (object | string)[]): void;

            /**
             * Gets the previous source mappings.
             */
            public readonly sourceMappings: (object | string)[];

            /**
             * Prepares the program body.
             */
            prepare(): void;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
