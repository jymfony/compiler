const ClassMemberInterface = require('./ClassMemberInterface');
const Function = require('./Function');
const Identifier = require('./Identifier');

class ClassMethod extends mix(Function, ClassMemberInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {BlockStatement} body
     * @param {Identifier} id
     * @param {'constructor' | 'method' | 'get' | 'set'} kind
     * @param {PatternInterface[]} [params = []]
     * @param {boolean} [generator = false]
     * @param {boolean} [async = false]
     * @param {boolean} [Static = false]
     * @param {boolean} [Private = false]
     */
    __construct(location, body, id, kind, params = [], { generator = false, async = false, Static = false, Private = false } = {}) {
        super.__construct(location, body, id, params, { generator, async });

        /**
         * @type {'constructor' | 'method' | 'get' | 'set'}
         *
         * @private
         */
        this._kind = kind;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._static = Static;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._private = Private;

        /**
         * @type {null|string}
         */
        this.docblock = null;
    }

    /**
     * Gets the identifier.
     *
     * @returns {Identifier}
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the name of the method.
     *
     * @returns {Identifier}
     */
    get key() {
        return this.id;
    }

    /**
     * Gets the method kind.
     *
     * @returns {'constructor' | 'method' | 'get' | 'set'}
     */
    get kind() {
        return this._kind;
    }

    /**
     * Whether this method is static.
     *
     * @returns {boolean}
     */
    get static() {
        return this._static;
    }

    /**
     * Whether this method is private.
     *
     * @returns {boolean}
     */
    get private() {
        return this._private;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._static) {
            compiler._emit('static ');
        }

        if (this._async) {
            compiler._emit('async ');
        }

        if (this._generator) {
            compiler._emit('* ');
        }

        if ('constructor' !== this._kind && 'method' !== this._kind) {
            compiler._emit(this._kind + ' ');
        }

        if (this._private) {
            compiler._emit('#');
        }

        if (this._id instanceof Identifier) {
            compiler.compileNode(this._id);
        } else {
            compiler._emit('[');
            compiler.compileNode(this._id);
            compiler._emit(']');
        }

        Function.compileParams(compiler, this._params);
        compiler._emit(' ');
        compiler.compileNode(this._body);
    }
}

module.exports = ClassMethod;
