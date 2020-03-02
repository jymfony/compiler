declare class FunctionStatement extends mix(Function, StatementInterface) {
    /**
     * @inheritdoc
     */
    compile(compiler: Compiler): void;
}
