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
     * Removes a class member.
     *
     * @param {ClassMemberInterface} member
     *
     * @throws {InvalidArgumentException} If passed argument is not part of this class body.
     */
    removeMember(member) {
        const idx = this._body.indexOf(member);
        if (-1 === idx) {
            throw new InvalidArgumentException('Specified member is not part of this class body');
        }

        this._body.splice(idx, 1);
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
            compiler.newLine();
            compiler.compileNode(member);
        }
    }
}

module.exports = ClassBody;
