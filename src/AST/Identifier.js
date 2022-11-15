const ExpressionInterface = require('./ExpressionInterface');
const NodeInterface = require('./NodeInterface');
const PatternInterface = require('./PatternInterface');

class Identifier extends implementationOf(NodeInterface, ExpressionInterface, PatternInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {string} name
     */
    __construct(location, name) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {string}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {null|string}
         */
        this.docblock = null;
    }

    /**
     * @inheritdoc
     */
    prepare() {
        // Do nothing.
    }

    /**
     * Gets the identifier name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @inheritdoc
     */
    get names() {
        return [ this ];
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(this._name);
    }
}

module.exports = Identifier;
