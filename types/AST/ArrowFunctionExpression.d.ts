declare module "@jymfony/compiler" {
    namespace AST {
        class ArrowFunctionExpression extends Function {
            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
