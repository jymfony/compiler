declare module "@jymfony/compiler" {
    namespace AST {
        class NodeInterface implements MixinInterface {
            public static readonly definition: Newable<NodeInterface>;

            /**
             * Compiles a node.
             */
            compile(compiler: Compiler): void;

            /**
             * Prepares a node (do transformations, compile temporary variables, etc.)
             */
            prepare(compiler: Compiler): void;
        }
    }
}
