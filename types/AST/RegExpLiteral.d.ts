declare module "@jymfony/compiler" {
    namespace AST {
        class RegExpLiteral extends Literal {
            private _value: string;

            /**
             * Constructor.
             */
            // @ts-ignore
            __construct(location: SourceLocation, value: string): void;
            constructor(location: SourceLocation, value: string);

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
