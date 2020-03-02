declare module "@jymfony/compiler" {
    namespace AST {
        class NewExpression extends CallExpression {
            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
