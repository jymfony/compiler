declare module "@jymfony/compiler" {
    namespace AST {
        class ClassMemberInterface extends NodeInterface.definition implements MixinInterface {
            public static readonly definition: Newable<ClassMemberInterface>;

            /**
             * The name of the class member.
             */
            public readonly key: ExpressionInterface;

            /**
             * Compiles the decorators.
             * Code to be appended should be returned as an array of statements.
             */
            compileDecorators(compiler: Compiler, target: Class): StatementInterface[];
        }
    }
}
