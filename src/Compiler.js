const AST = require('./AST');
const Generator = require('./SourceMap/Generator');
const vm = require('vm');

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
const reflectionData = new Map();
const extraReflectionData = new Map();

class Compiler {
    /**
     * Constructor.
     *
     * @param {Generator} sourceMapGenerator
     * @param {{filename?: string, namespace?: string}} data
     */
    constructor(sourceMapGenerator, data = undefined) {
        const { filename = '/program.js', namespace = '' } = data || {};

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
         * @type {string}
         *
         * @private
         */
        this._filename = filename;

        /**
         * @type {string}
         *
         * @private
         */
        this._namespace = namespace;

        /**
         * @type {int}
         */
        this.indentationLevel = 0;
    }

    /**
     * Gets the current filename.
     *
     * @return {string}
     */
    get currentFilename() {
        return this._filename;
    }

    /**
     * Gets the current namespace.
     *
     * @return {string}
     */
    get currentNamespace() {
        return this._namespace;
    }

    /**
     * Compiles a source node.
     *
     * @param {AST.NodeInterface} node
     */
    compileNode(node) {
        this.pushLocation(node);

        if ('function' === typeof node.prepare) {
            node.prepare(this);
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
     * Serialize the function parameters.
     *
     * @param {AST.Function} func
     *
     * @private
     */
    static _getFunctionParams(func) {
        const parameters = [];
        for (let parameter of func.params) {
            parameter = parameter.pattern;

            let $default = undefined;
            let restElement = false;
            if (parameter instanceof AST.AssignmentPattern) {
                $default = parameter.right;
                parameter = parameter.left;
            }

            if (parameter instanceof AST.RestElement) {
                parameter = parameter.argument;
                restElement = true;
            } else if (parameter instanceof AST.SpreadElement) {
                parameter = parameter.expression;
                restElement = true;
            }

            let name = null;
            let objectPattern = false;
            let arrayPattern = false;
            if (parameter instanceof AST.Identifier) {
                name = parameter.name;
            } else if (parameter instanceof AST.ObjectPattern) {
                objectPattern = true;
            } else if (parameter instanceof AST.ArrayPattern) {
                arrayPattern = true;
            }

            let compiledDefault = false;
            const index = parameters.length;
            parameters.push({
                name,
                index,
                get default() {
                    if (compiledDefault) {
                        return $default;
                    }

                    if (undefined !== $default) {
                        const compiler = new Compiler(new Generator({ skipValidation: true }));
                        try {
                            $default = vm.runInNewContext(compiler.compile($default));
                        } catch (e) {
                            $default = undefined;
                        }
                    }

                    compiledDefault = true;

                    return $default;
                },
                objectPattern,
                arrayPattern,
                restElement,
            });
        }

        return parameters;
    }

    /**
     * Get data for reflection.
     *
     * @param {Function} value
     *
     * @return {*}
     */
    static getReflectionData(value) {
        const typeId = value[Symbol.reflection];
        const { ast: astObject, filename, namespace } = reflectionData.get(typeId);
        let name;

        if (astObject instanceof AST.Class) {
            const accessors = astObject.body.members.filter(m => m instanceof AST.ClassAccessor);
            const propertyNames = astObject.body.members
                .filter(m => (m instanceof AST.ClassProperty || m instanceof AST.ClassAccessor))
                .filter(m => m.key instanceof AST.Identifier)
                .map(m => (m.private ? '#' : '') + m.key.name);

            const methods = [];
            const fields = [];
            name = astObject.name;

            for (const member of astObject.body.members) {
                if (member instanceof AST.ClassMethod) {
                    if (!(member.key instanceof AST.Identifier)) {
                        continue;
                    }

                    if (member.origin && accessors.includes(member.origin)) {
                        continue;
                    }

                    const funcValue = (() => {
                        if (member.private) {
                            const accessors = value[Symbol.jymfony_private_accessors];
                            const type = member.static ? 'staticMethods' : 'methods';

                            return accessors && accessors[type] && accessors[type][member.key.name] ?
                                accessors[type][member.key.name].call : undefined;
                        }

                        if ('constructor' === member.key.name) {
                            return value;
                        }

                        const obj = member.static ? value : value.prototype;
                        const descriptor = Object.getOwnPropertyDescriptor(obj, member.key.name);

                        return 'method' === (member.kind || 'method') ? descriptor.value : descriptor[member.kind];
                    })();

                    methods.push({
                        name: (member.private ? '#' : '') + member.key.name,
                        kind: member.kind || 'method',
                        static: member.static,
                        private: member.private,
                        value: funcValue,
                        ownClass: value,
                        parameters: this._getFunctionParams(member),
                    });

                    if ('constructor' === member.key.name || '__construct' !== member.key.name) {
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

                            if (declaredField.name.startsWith('#')) {
                                continue;
                            }

                            fields.push({
                                name: declaredField.name,
                                static: false,
                                private: false,
                                get: (obj) => obj[declaredField.name],
                                set: (obj, vv) => obj[declaredField.name] = vv,
                                ownClass: value,
                            });
                        }
                    }
                } else if (member instanceof AST.ClassProperty) {
                    if (!(member.key instanceof AST.Identifier)) {
                        continue;
                    }

                    const accessors = value[Symbol.jymfony_private_accessors];
                    const type = member.static ? 'staticFields' : 'fields';
                    fields.push({
                        name: (member.private ? '#' : '') + member.key.name,
                        kind: 'field',
                        static: member.static,
                        private: member.private,
                        get: member.private ?
                            (accessors && accessors[type] && accessors[type]['#' + member.key.name] ? accessors[type]['#' + member.key.name].get : undefined) :
                            (obj) => (member.static ? value : obj)[member.key.name],
                        set: member.private ?
                            (accessors && accessors[type] && accessors[type]['#' + member.key.name] ? accessors[type]['#' + member.key.name].set : undefined) :
                            (obj, vv) => (member.static ? value : obj)[member.key.name] = vv,
                        ownClass: value,
                    });
                } else if (member instanceof AST.ClassAccessor) {
                    if (!(member.key instanceof AST.Identifier)) {
                        continue;
                    }

                    const accessors = value[Symbol.jymfony_private_accessors];
                    const type = member.static ? 'staticFields' : 'fields';

                    const descriptor = !member.private ? (() => {
                        const desc = Object.getOwnPropertyDescriptor(member.static ? value : value.prototype, member.key.name);
                        const ret = {
                            get: obj => desc.get.call(obj),
                            set: (obj, vv) => desc.set.call(obj, vv),
                        };

                        ret.get[Symbol.metadata] = desc.get[Symbol.metadata];
                        ret.set[Symbol.metadata] = desc.set[Symbol.metadata];

                        return ret;
                    })() : {
                        get: accessors && accessors[type] && accessors[type]['#' + member.key.name] ? accessors[type]['#' + member.key.name].get : undefined,
                        set: accessors && accessors[type] && accessors[type]['#' + member.key.name] ? accessors[type]['#' + member.key.name].set : undefined,
                    };

                    fields.push({
                        name: (member.private ? '#' : '') + member.key.name,
                        kind: 'accessor',
                        static: member.static,
                        private: member.private,
                        get: descriptor.get,
                        set: descriptor.set,
                        ownClass: value,
                    });
                } else if (member.lazyNode) {
                    // Do nothing
                } else {
                    throw new Error('Unexpected. Err: reflection_class_body_1');
                }
            }

            return {
                ...(extraReflectionData.get(typeId) || {}),
                fqcn: (namespace ? namespace + '.' : '') + name,
                namespace: namespace,
                filename,
                constructor: value.definition ? null : value,
                methods,
                fields,
                docblock: astObject.docblock,
            };
        }

        throw new Error('Unexpected. Err: reflection_ast_1');
    }

    static setExtraReflectionData(value, data) {
        extraReflectionData.set(value[Symbol.reflection], data);
    }

    static pushReflectionData(typeId, data) {
        reflectionData.set(typeId, data);
    }
}

module.exports = Compiler;
