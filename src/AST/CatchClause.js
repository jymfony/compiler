const NodeInterface = require('./NodeInterface');

class CatchClause extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {null|PatternInterface} param
     * @param {BlockStatement} block
     */
    __construct(location, param, block) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {PatternInterface}
         *
         * @private
         */
        this._param = param;

        /**
         * @type {BlockStatement}
         *
         * @private
         */
        this._block = block;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        if (null !== this._param) {
            this._param.prepare(compiler);
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(' catch (');
        if (null !== this._param) {
            compiler.compileNode(this._param);
        } else {
            compiler._emit('Ξ_');
        }
        compiler._emit(') ');

        compiler.compileNode(this._block);
    }
}

module.exports = CatchClause;
