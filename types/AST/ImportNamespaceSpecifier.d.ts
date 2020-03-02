declare module "@jymfony/compiler" {
    namespace AST {
        class ImportNamespaceSpecifier extends implementationOf(ImportSpecifierInterface) {
            public location: SourceLocation;
            private _local: Identifier;

            /**
             * Gets the local name.
             */
            public readonly local: Identifier;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, local: Identifier): void;

            constructor(location: SourceLocation, local: Identifier);
        }
    }
}
