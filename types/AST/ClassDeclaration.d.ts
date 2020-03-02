declare class ClassDeclaration extends mix(Class, DeclarationInterface) {
    /**
     * @inheritdoc
     */
    compile(compiler: Compiler): void;
}
