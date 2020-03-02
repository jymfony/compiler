declare class FunctionExpression extends mix(Function, ExpressionInterface) {
    /**
     * @inheritdoc
     */
    compile(compiler: Compiler): void;
}
