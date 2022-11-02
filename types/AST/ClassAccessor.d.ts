declare module "@jymfony/compiler" {
    namespace AST {
        class ClassAccessor extends implementationOf(ClassMemberInterface) {
            public location: SourceLocation;
            public docblock: null | string;
            public decorators: null | AppliedDecorator[];

            private _key: ExpressionInterface;
            private _value: ExpressionInterface;
            private _static: boolean;
            private _private: boolean;
            private _class: null | Class;
            private _privateSymbolIdentifier: null | Identifier;
            private _initializerIdentifier: null | Identifier;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, key: ExpressionInterface, value: ExpressionInterface, Static: boolean, Private: boolean): void;
            constructor(location: SourceLocation, key: ExpressionInterface, value: ExpressionInterface, Static: boolean, Private: boolean);

            /**
             * Gets the key.
             */
            public readonly key: ExpressionInterface;

            /**
             * Whether this property is static.
             */
            public readonly static: boolean;

            /**
             * Whether this property is private.
             */
            public readonly private: boolean;

            /**
             * Gets the initialization value.
             */
            public readonly value: ExpressionInterface;

            /**
             * Clears out the initialization value.
             */
            clearValue(): void;

            /**
             * Gets the private symbol backing the auto-accessor.
             */
            public readonly privateSymbolIdentifier: null | Identifier;

            /**
             * Gets the private symbol backing the auto-accessor initializer.
             */
            public readonly initializerIdentifier: null | Identifier;

            /**
             * Prepares the accessor for compilation.
             */
            prepare(compiler: Compiler, class_: Class): void;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
