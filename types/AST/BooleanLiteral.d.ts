declare module "@jymfony/compiler" {
    namespace AST {
        class BooleanLiteral extends Literal {
            private _value: boolean;

            /**
             * Constructor.
             */
            // @ts-ignore
            __construct(location: SourceLocation, value: boolean): void;

            constructor(location: SourceLocation, value: boolean);

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
