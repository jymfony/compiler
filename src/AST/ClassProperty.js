const ClassMemberInterface = require('./ClassMemberInterface');
const Identifier = require('./Identifier');

class ClassProperty extends implementationOf(ClassMemberInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} key
     * @param {ExpressionInterface} value
     * @param {boolean} Static
     * @param {boolean} Private
     */
    __construct(location, key, value, Static, Private) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._key = key;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._value = value;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._static = Static;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._private = Private;

        /**
         * @type {null|string}
         */
        this.docblock = null;

        /**
         * @type {null|AppliedDecorator[]}
         */
        this.decorators = null;
    }

    /**
     * Gets the key.
     *
     * @return {ExpressionInterface}
     */
    get key() {
        return this._key;
    }

    /**
     * Whether this property is static.
     *
     * @return {boolean}
     */
    get static() {
        return this._static;
    }

    /**
     * Whether this property is private.
     *
     * @return {boolean}
     */
    get private() {
        return this._private;
    }

    /**
     * Gets the initialization value.
     *
     * @returns {ExpressionInterface}
     */
    get value() {
        return this._value;
    }

    /**
     * Clears out the initialization value.
     */
    clearValue() {
        this._value = null;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._static) {
            compiler._emit('static ');
        }

        if (this._private) {
            compiler._emit('#');
        }

        if (this._key instanceof Identifier) {
            compiler.compileNode(this._key);
        } else {
            compiler._emit('[');
            compiler.compileNode(this._key);
            compiler._emit(']');
        }

        if (null !== this._value) {
            compiler._emit(' = ');
            compiler.compileNode(this._value);
        }

        compiler._emit(';');
    }
}

module.exports = ClassProperty;
