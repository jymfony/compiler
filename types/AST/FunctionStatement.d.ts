declare module "@jymfony/compiler" {
    namespace AST {
        class FunctionStatement extends mix(Function, StatementInterface) {
            public readonly shouldBeClosed: boolean;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
