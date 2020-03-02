const ExpressionInterface = require('./ExpressionInterface');

class Literal extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     */
    __construct(location) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;
    }
}

module.exports = Literal;
