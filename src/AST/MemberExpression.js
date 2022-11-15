const ExpressionInterface = require('./ExpressionInterface');
const Identifier = require('./Identifier');
const NumberLiteral = require('./NumberLiteral');
const ParenthesizedExpression = require('./ParenthesizedExpression');

class MemberExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} object
     * @param {ExpressionInterface} property
     * @param {boolean} computed
     * @param {boolean} optional
     */
    __construct(location, object, property, computed, optional = false) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._object = object;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._property = property;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._computed = computed;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._optional = optional;
    }

    /**
     * Gets the property accessed by this member access expression.
     *
     * @return {ExpressionInterface}
     */
    get property() {
        return this._property;
    }

    /**
     * Whether the object of the member expression is "this"
     *
     * @return {boolean}
     */
    get isObjectThis() {
        return this._object instanceof Identifier &&
            'this' === this._object.name;
    }

    prepare(compiler) {
        this._object.prepare(compiler);
        this._property.prepare(compiler);
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (this._object instanceof NumberLiteral) {
            compiler.compileNode(new ParenthesizedExpression(this.location, this._object));
        } else {
            compiler.compileNode(this._object);
        }

        if (this._optional) {
            compiler._emit('?.');
        }

        if (this._computed) {
            compiler._emit('[');
            compiler.compileNode(this._property);
            compiler._emit(']');
        } else {
            if (! this._optional) {
                compiler._emit('.');
            }

            compiler.compileNode(this._property);
        }
    }
}

module.exports = MemberExpression;
