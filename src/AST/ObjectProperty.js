const Identifier = require('./Identifier');
const ObjectMember = require('./ObjectMember');
const StringLiteral = require('./StringLiteral');
let ClassExpression;

class ObjectProperty extends implementationOf(ObjectMember) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} key
     * @param {ExpressionInterface} value
     */
    __construct(location, key, value) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @protected
         */
        this._key = key;

        /**
         * @type {ExpressionInterface}
         *
         * @protected
         */
        this._value = value;
    }

    prepare(compiler) {
        if (undefined === ClassExpression) {
            ClassExpression = require('./ClassExpression');
        }

        if (this._value instanceof ClassExpression) {
            this._value.forceWrap = true;
        }

        if (null !== this._value) {
            this._value.prepare(compiler);
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._key instanceof Identifier ||
            (this._key instanceof StringLiteral && (this._key.value.startsWith('\'') || this._key.value.startsWith('"')))) {
            compiler.compileNode(this._key);
        } else {
            compiler._emit('[');
            compiler.compileNode(this._key);
            compiler._emit(']');
        }

        if (null !== this._value) {
            compiler._emit(': ');
            compiler.compileNode(this._value);
        }
    }
}

module.exports = ObjectProperty;
