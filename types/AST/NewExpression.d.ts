declare module "@jymfony/compiler" {
    namespace AST {
        class NewExpression extends CallExpression {
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
