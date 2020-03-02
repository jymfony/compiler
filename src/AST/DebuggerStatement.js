const StatementInterface = require('./StatementInterface');

class DebuggerStatement extends implementationOf(StatementInterface) {
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
        compiler._emit('debugger');
    }
}

module.exports = DebuggerStatement;
