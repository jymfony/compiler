const NodeInterface = require('./NodeInterface');

class StatementInterface extends NodeInterface.definition {
    /**
     * Whether the statement should be closed with a semicolon.
     */
    get shouldBeClosed() { }
}

module.exports = getInterface(StatementInterface);
