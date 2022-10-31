const AST = require('./AST');

if (undefined === Object.getOwnPropertyDescriptor(Symbol, 'metadata')) {
    Object.defineProperty(Symbol, 'metadata', {
        configurable: false,
        enumerable: false,
        value: Symbol('Symbol.metadata'),
        writable: false,
    });
}

if (undefined === Object.getOwnPropertyDescriptor(Symbol, 'jymfony_private_accessors')) {
    Object.defineProperty(Symbol, 'jymfony_private_accessors', {
        configurable: false,
        enumerable: false,
        value: Symbol('Jymfony private fields accessors'),
        writable: false,
    });
}

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

        /**
         * @type {int}
         */
        this.indentationLevel = 0;

        /**
         * @type {Map<int, *>}
         *
         * @private
         */
        this._reflectionData = new Map();
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
     * Emit a newline.
     */
    newLine() {
        this._emit('\n'+ ('  '.repeat(this.indentationLevel)));
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

    /**
     * Get data for reflection.
     *
     * @param {Function} value
     *
     * @return {*}
     */
    getReflectionData(value) {
        const typeId = value[Symbol.reflection];
        const astObject = this._reflectionData.get(typeId);

        if (astObject instanceof AST.Class) {
            const propertyNames = members
                .filter(m => m instanceof AST.ClassProperty)
                .filter(m => m.key instanceof AST.Identifier)
                .map(m => (m.private ? '#' : '') + m.key.name);

            const methods = [];
            const fields = [];

            for (const member of astObject.members) {
                if (member instanceof AST.ClassMethod) {
                    methods.push({
                        name: member.id instanceof AST.Identifier ? member.id.name : undefined,
                        kind: member.kind,
                        static: member.static,
                        private: member.private,
                    });

                    if ('constructor' === member.name || '__construct' === member.name) {
                        for (const statement of member.body.statements) {
                            if (!statement.isFieldDeclaration) {
                                continue;
                            }

                            const declaredField = statement.fieldDeclarationExpression;
                            if (!(declaredField instanceof AST.Identifier)) {
                                continue;
                            }

                            if (propertyNames.includes(declaredField.name)) {
                                continue;
                            }

                            const Private = declaredField.name.startsWith('#');
                            fields.push({
                                name: Private ? declaredField.name.substring(1) : declaredField.name,
                                static: false,
                                private: Private,
                            });
                        }
                    }
                } else if (member instanceof AST.ClassProperty) {
                    if (member instanceof AST.ClassPrototypeProperty) {
                        continue;
                    }

                    if (!(member.key instanceof AST.Identifier)) {
                        continue;
                    }

                    const accessors = value[Symbol.jymfony_private_accessors];
                    const type = member.static ? 'staticFields' : 'fields';
                    fields.push({
                        name: member.key.name,
                        static: member.static,
                        private: member.private,
                        get: member.private ?
                            (accessors && accessors[type] && accessors[type]['#' + member.key.name] ? accessors[type]['#' + member.key.name].get : undefined) :
                            (obj) => (member.static ? value : obj)[member.key.name],
                        set: member.private ?
                            (accessors && accessors[type] && accessors[type]['#' + member.key.name] ? accessors[type]['#' + member.key.name].set : undefined) :
                            (obj, value) => (member.static ? value : obj)[member.key.name] = value,
                    });
                } else {
                    debugger;
                }
            }

            return {
                methods,
                fields,
            };
        }
        debugger;
    }
}

module.exports = Compiler;
