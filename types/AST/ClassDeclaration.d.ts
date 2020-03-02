declare module "@jymfony/compiler" {
    namespace AST {
        class ClassDeclaration extends mix(Class, DeclarationInterface) {
            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
