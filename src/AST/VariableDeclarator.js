const NodeInterface = require('./NodeInterface');

class VariableDeclarator extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {PatternInterface} id
     * @param {ExpressionInterface} init
     */
    __construct(location, id, init = null) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {PatternInterface}
         *
         * @private
         */
        this._id = id;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._init = init;
    }

    /**
     * Gets the id.
     *
     * @return {PatternInterface}
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the init value.
     *
     * @returns {ExpressionInterface}
     */
    get init() {
        return this._init;
    }

    /**
     * Execute preliminary work for node compilation.
     *
     * @param {Compiler} compiler
     */
    prepare(compiler) {
        if (null !== this._init && 'function' === typeof this._init.prepare) {
            this._init.prepare(compiler);
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._id);

        if (null !== this._init) {
            compiler._emit(' = ');
            compiler.compileNode(this._init);
        }
    }
}

module.exports = VariableDeclarator;
