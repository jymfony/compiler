const AST = require('./AST');

const nonFirstChars = 'abcdefghijklmnopqrstuvwxyz0123456789_';

class Compiler {
    /**
     * Constructor.
     *
     * @param {Generator} sourceMapGenerator
     */
    constructor(sourceMapGenerator) {
        /**
         * @type {string}
         *
         * @private
         */
        this._code = '';

        /**
         * @type {AST.SourceLocation[]}
         *
         * @private
         */
        this._locations = [];

        /**
         * @type {Generator}
         *
         * @private
         */
        this._sourceMapGenerator = sourceMapGenerator;

        /**
         * @type {int}
         *
         * @private
         */
        this._line = 1;

        /**
         * @type {int}
         *
         * @private
         */
        this._column = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._variableCount = 1;
    }

    /**
     * Compiles a source node.
     *
     * @param {AST.NodeInterface} node
     */
    compileNode(node) {
        this.pushLocation(node);

        if (node instanceof AST.Class && null === node.superClass && ! node.hasConstructor) {
            node.superClass = new AST.Identifier(null, '__jymfony.JObject');
        }

        node.compile(this);
        this.popLocation();
    }

    /**
     * Sets the original source location.
     *
     * @param {AST.NodeInterface} node
     */
    pushLocation(node) {
        const location = node.location;

        this._locations.push(location);
        this._sourceMapGenerator.addMapping({
            generated: new AST.Position(this._line, this._column),
            original: null !== location ? location.start : null,
        });
    }

    /**
     * Pops out the latest source location.
     */
    popLocation() {
        this._locations.pop();
    }

    /**
     * @param {AST.Program} program
     */
    compile(program) {
        this._code = '';
        this._variableCount = 1;

        this.compileNode(program);
        this._sourceMapGenerator.sourceContent = program.location ? program.location.source : null;

        for (const mapping of program.sourceMappings || []) {
            if (isString(mapping)) {
                continue;
            }

            this._sourceMapGenerator.applyMapping(mapping.mappings, mapping.sources, mapping.sourcesContent || []);
        }

        const sourceMapJson = this._sourceMapGenerator.toJSON() || {};
        if (0 < Object.keys(sourceMapJson).length) {
            this._code += '\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
                Buffer.from(JSON.stringify(sourceMapJson)).toString('base64');
        }

        return this._code;
    }

    /**
     * Emits a code string.
     *
     * @param {string} code
     */
    _emit(code) {
        for (const char of code.split('')) {
            this._code += char;

            if ('\n' === char) {
                this._line++;
                this._column = 0;
            } else {
                this._column++;
            }
        }
    }

    /**
     * @returns {string}
     */
    get code() {
        return this._code;
    }

    /**
     * @returns {string}
     */
    generateVariableName() {
        let name = 'α';
        let i = this._variableCount;

        while (0 < i) {
            --i;
            name += nonFirstChars[i % nonFirstChars.length];
            i = ~~(i / nonFirstChars.length);
        }

        ++this._variableCount;

        return name;
    }
}

module.exports = Compiler;
