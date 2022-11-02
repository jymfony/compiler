declare module "@jymfony/compiler" {
    namespace AST {
        abstract class Class extends implementationOf(NodeInterface) {
            public location: SourceLocation;
            public docblock: null | string;
            public decorators: null | AppliedDecorator[];

            private _typeId: number;
            private _body: ClassBody;
            private _id: Identifier;
            private _superClass: ExpressionInterface | null;
            private _fieldInitializer: ExpressionInterface | null;
            private _initialization: ExpressionInterface[];
            private _initializableFields: ClassProperty[];

            /**
             * Gets the class name.
             */
            public readonly name: string;

            /**
             * Gets the class identifier.
             */
            public readonly id: Identifier;

            /**
             * Gets the class body.
             */
            public readonly body: ClassBody;

            /**
             * Gets/sets the superclass.
             */
            public superClass: null | ExpressionInterface;

            /**
             * Class has constructor.
             */
            public readonly hasConstructor: boolean;

            /**
             * Constructor.
             */
            __construct(location: SourceLocation, body: ClassBody, id?: Identifier | null, superClass?: ExpressionInterface | null): void;
            constructor(location: SourceLocation, body: ClassBody, id?: Identifier | null, superClass?: ExpressionInterface | null);

            /**
             * Returns the class constructor or null.
             */
            getConstructor(): null | ClassMethod;

            /**
             * Returns the class member with given name or null.
             */
            getMember(name: string): ClassMemberInterface | null;

            /**
             * @inheritdoc
             */
            compile(compiler: Compiler, initialization?: string): void;

            /**
             * Compiles the decorators upon this class.
             */
            compileDecorators(compiler: Compiler): StatementInterface[];

            private _prepare(compiler: Compiler, initializationSymbol: string): void;
        }
    }
}
