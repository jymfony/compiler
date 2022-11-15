const ExpressionInterface = require('./ExpressionInterface');

class TaggedTemplateExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} tag
     * @param {StringLiteral} template
     */
    __construct(location, tag, template) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._tag = tag;

        /**
         * @type {StringLiteral}
         *
         * @private
         */
        this._template = template;
    }

    /**
     * @inheritdoc
     */
    prepare(compiler) {
        this._tag.prepare(compiler);
    }

    /**
     * Gets the tag expression.
     *
     * @return {ExpressionInterface}
     */
    get tag() {
        return this._tag;
    }

    /**
     * Gets the template string.
     *
     * @return {StringLiteral}
     */
    get template() {
        return this._template;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._tag);
        compiler.compileNode(this._template);
    }
}

module.exports = TaggedTemplateExpression;
