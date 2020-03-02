const NodeInterface = require('./NodeInterface');

class PatternInterface extends NodeInterface.definition {
    /**
     * Gets the names defined in pattern (or children subpatterns)
     *
     * @returns {(Identifier|ObjectMember)[]}
     */
    get names() { }
}

module.exports = getInterface(PatternInterface);
