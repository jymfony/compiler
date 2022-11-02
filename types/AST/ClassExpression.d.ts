declare module "@jymfony/compiler" {
    namespace AST {
        class ClassExpression extends mix(Class, ExpressionInterface) {
            compile(compiler: Compiler): void;
        }
    }
}
