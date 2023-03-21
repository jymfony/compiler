const ExpressionInterface = require('./ExpressionInterface');

class ObjectExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ObjectMember[]} properties
     */
    __construct(location, properties) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ObjectMember[]}
         *
         * @private
         */
        this._properties = properties;
    }

    /**
     * @returns {ObjectMember[]}
     */
    get properties() {
        return this._properties;
    }

    prepare(compiler) {
        for (const p of this._properties) {
            p.prepare(compiler);
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.indentationLevel++;
        compiler._emit('{');

        for (const property of this._properties) {
            compiler.newLine();
            compiler.compileNode(property);
            compiler._emit(',');
        }

        compiler.indentationLevel--;
        compiler.newLine();
        compiler._emit('}');
    }
}

module.exports = ObjectExpression;
