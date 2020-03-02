declare module "@jymfony/compiler" {
    namespace AST {
        class FunctionStatement extends mix(Function, StatementInterface) {
            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
