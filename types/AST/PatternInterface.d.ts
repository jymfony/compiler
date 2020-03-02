declare module "@jymfony/compiler" {
    namespace AST {
        class PatternInterface extends NodeInterface.definition implements MixinInterface {
            public static readonly definition: Newable<PatternInterface>;

            /**
             * Gets the names defined in pattern (or children subpatterns).
             */
            public readonly names: (Identifier | ObjectMember)[];
        }
    }
}
