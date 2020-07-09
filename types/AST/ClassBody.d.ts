declare module "@jymfony/compiler" {
    namespace AST {
        class ClassBody extends implementationOf(NodeInterface) {
            public location: SourceLocation;
            private _body: ClassMemberInterface[];

            /**
             * Gets class member array.
             * Not a shallow copy.
             */
            public readonly members: ClassMemberInterface[];

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, body: ClassMemberInterface[]): void;
            constructor(location: SourceLocation, body: ClassMemberInterface[]);

            /**
             * Adds a class member.
             */
            addMember(member: ClassMemberInterface): void;

            /**
             * Removes a class member.
             *
             * @throws {InvalidArgumentException} If passed argument is not part of this class body.
             */
            removeMember(member: ClassMemberInterface): void;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler): void;
        }
    }
}
