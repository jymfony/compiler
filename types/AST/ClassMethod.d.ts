declare module "@jymfony/compiler" {
    namespace AST {
        class ClassMethod extends mix(Function, ClassMemberInterface) {
            public location: SourceLocation;
            public docblock: null | string;
            public origin: NodeInterface;

            private _kind: 'constructor' | 'method' | 'get' | 'set';
            private _static: boolean;
            private _private: boolean;

            /**
             * Constructor.
             */
            // @ts-ignore
            __construct(location: SourceLocation, body: BlockStatement, id: Identifier, kind: 'constructor' | 'method' | 'get' | 'set', params?: PatternInterface[], { generator, async, Private, Static }?: { generator?: boolean, async?: boolean, Private?: boolean, Static?: boolean }): void;
            constructor(location: SourceLocation, body: BlockStatement, id: Identifier, kind: 'constructor' | 'method' | 'get' | 'set', params?: PatternInterface[], { generator, async, Private, Static }?: { generator?: boolean, async?: boolean, Private?: boolean, Static?: boolean });

            /**
             * Gets the name of the method.
             */
            public readonly id: Identifier;

            /**
             * Gets the method kind.
             */
            public readonly kind: 'constructor' | 'method' | 'get' | 'set';

            /**
             * Whether this method is static.
             */
            public readonly static: boolean;

            /**
             * Whether this method is private.
             */
            public readonly private: boolean;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
