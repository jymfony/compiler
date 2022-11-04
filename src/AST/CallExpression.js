const { Iife, Variable } = require('../Generator');
const BlockStatement = require('./BlockStatement');
const ExpressionInterface = require('./ExpressionInterface');
const Identifier = require('./Identifier');
const Function = require('./Function');
const ParenthesizedExpression = require('./ParenthesizedExpression');
const ReturnStatement = require('./ReturnStatement');
let Class;

class CallExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ExpressionInterface} callee
     * @param {(ExpressionInterface|SpreadElement)[]} args
     * @param {boolean} [optional = false]
     */
    __construct(location, callee, args, optional = false) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._callee = callee;

        /**
         * @type {(ExpressionInterface|SpreadElement)[]}
         *
         * @private
         */
        this._args = args;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._optional = optional;
    }

    /**
     * Gets the callee expression.
     *
     * @returns {ExpressionInterface}
     */
    get callee() {
        return this._callee;
    }

    /**
     * Gets the arguments.
     *
     * @returns {(ExpressionInterface|SpreadElement)[]}
     */
    get args() {
        return this._args;
    }

    _prepareArg(arg, compiler) {
        if (undefined === Class) {
            Class = require('./Class');
        }

        if (arg instanceof Class) {
            return new ParenthesizedExpression(null, Iife.create(new BlockStatement(null, [
                Variable.create('const', arg.name, arg),
                new ReturnStatement(null, new Identifier(null, arg.name)),
            ])));
        } else if ('function' === typeof arg.prepare) {
            arg.prepare(compiler);
        }

        return null;
    }

    prepare(compiler) {
        const id = this._prepareArg(this._callee, compiler);
        if (null !== id) {
            this._callee = id;
        }

        for (const [ idx, arg ] of __jymfony.getEntries(this._args || [])) {
            if ('function' === typeof arg.prepare) {
                const id = this._prepareArg(arg, compiler);
                if (null !== id) {
                    this._args[idx] = id;
                }
            }
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._callee);
        if (this._optional) {
            compiler._emit('?.');
        }

        Function.compileParams(compiler, this._args);
    }
}

module.exports = CallExpression;
