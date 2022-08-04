declare module "@jymfony/compiler" {
    export class Compiler {
        public readonly code: string;
        public indentationLevel: number;

        private _code: string;
        private _locations: AST.SourceLocation[];
        private _sourceMapGenerator: Generator;
        private _line: number;
        private _column: number;
        private _variableCount: number;

        /**
         * Constructor.
         */
        constructor(sourceMapGenerator: Generator);

        /**
         * Compiles a source node.
         */
        compileNode(node: AST.NodeInterface): void;

        /**
         * Sets the original source location.
         */
        pushLocation(node: AST.NodeInterface): void;

        /**
         * Pops out the latest source location.
         */
        popLocation(): void;

        compile(program: AST.Program): string;

        /**
         * Emits a code string.
         */
        _emit(code: string): void;

        /**
         * Emit a newline.
         */
        newLine(): void;

        /**
         * @internal
         */
        generateVariableName(): string;
    }
}
