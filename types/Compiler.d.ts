declare module "@jymfony/compiler" {
    export class Compiler {
        public readonly code: string;
        public readonly currentFilename: string;
        public readonly currentNamespace: string;
        public indentationLevel: number;

        private _code: string;
        private _locations: AST.SourceLocation[];
        private _sourceMapGenerator: Generator;
        private _line: number;
        private _column: number;
        private _variableCount: number;
        private _filename: string;
        private _namespace: string;

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

        compile(program: AST.Program, data?: { filename?: string, namespace?: string }): string;

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

        /**
         * Get data for reflection.
         */
        static getReflectionData(value: any): any;
        static setExtraReflectionData(value: any, data: any): void;
        private static pushReflectionData(typeId: number, data: AST.NodeInterface): void;
    }
}
