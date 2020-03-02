declare module "@jymfony/compiler" {
    namespace AST {
        class FunctionExpression extends mix(Function, ExpressionInterface) {
            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
