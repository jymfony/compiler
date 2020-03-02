const StatementInterface = require('./StatementInterface');

class EmptyStatement extends implementationOf(StatementInterface) {
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

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler._emit(';');
    }
}

module.exports = EmptyStatement;
