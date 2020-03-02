const NodeInterface = require('./NodeInterface');

class ClassBody extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ClassMemberInterface[]} body
     */
    __construct(location, body) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ClassMemberInterface[]}
         *
         * @private
         */
        this._body = body;
    }

    /**
     * Adds a class member.
     *
     * @param {ClassMemberInterface} member
     */
    addMember(member) {
        this._body.push(member);
    }

    /**
     * Gets class member array.
     * Not a shallow copy.
     *
     * @return {ClassMemberInterface[]}
     */
    get members() {
        return this._body;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        for (const member of this._body) {
            compiler.compileNode(member);
            compiler._emit('\n');
        }
    }
}

module.exports = ClassBody;
