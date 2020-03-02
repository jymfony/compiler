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
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit('{\n');

        for (const property of this._properties) {
            compiler.compileNode(property);
            compiler._emit(',');
        }

        compiler._emit('}');
    }
}

module.exports = ObjectExpression;
