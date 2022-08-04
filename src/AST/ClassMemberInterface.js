const NodeInterface = require('./NodeInterface');

/**
 * @property {AppliedDecorator[] | null} decorators
 */
class ClassMemberInterface extends NodeInterface.definition {
    /**
     * The name of the class member.
     *
     * @returns {ExpressionInterface}
     */
    get key() { }
}

module.exports = getInterface(ClassMemberInterface);
