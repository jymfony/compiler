declare module "@jymfony/compiler" {
    namespace AST {
        class NullLiteral extends Literal {
            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;

            /**
             * @inheritdoc
             */
            prepare(compiler: Compiler): void;
        }
    }
}
