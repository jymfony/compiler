declare module "@jymfony/compiler" {
    namespace AST {
        class NumberLiteral extends Literal {
            private _value: number;
            private _bigint: number;

            /**
             * Constructor.
             */
            // @ts-ignore
            __construct(location: SourceLocation, value: number | bigint): void;
            constructor(location: SourceLocation, value: number | bigint);

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
