declare module "@jymfony/compiler" {
    namespace AST {
        class DeclarationInterface extends StatementInterface.definition implements MixinInterface {
            public static readonly definition: Newable<DeclarationInterface>;
        }
    }
}
