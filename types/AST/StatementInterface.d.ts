declare module "@jymfony/compiler" {
    namespace AST {
        class StatementInterface extends NodeInterface.definition implements MixinInterface {
            public static readonly definition: Newable<StatementInterface>;
        }
    }
}
