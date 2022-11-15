const { Iife, Variable } = require('../Generator');
const BlockStatement = require('./BlockStatement');
const ExpressionInterface = require('./ExpressionInterface');
const Identifier = require('./Identifier');
const ReturnStatement = require('./ReturnStatement');
let Class;

class AssignmentExpression extends implementationOf(ExpressionInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {string} operator
     * @param {PatternInterface|ExpressionInterface} left
     * @param {ExpressionInterface} right
     */
    __construct(location, operator, left, right) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {string}
         *
         * @private
         */
        this._operator = operator;

        /**
         * @type {PatternInterface|ExpressionInterface}
         *
         * @private
         */
        this._left = left;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._right = right;
    }

    prepare(compiler) {
        if (undefined === Class) {
            Class = require('./Class');
        }

        this._left.prepare(compiler);
        this._right.prepare(compiler);
        if (this._right instanceof Class) {
            const varDecl = Variable.create('const', this._right.name, this._right);
            varDecl.declarators[0].prepare = () => {};

            this._right = Iife.create(new BlockStatement(null, [
                varDecl,
                new ReturnStatement(null, new Identifier(null, this._right.name)),
            ]));
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._left);
        compiler._emit(' ' + this._operator + ' ');
        compiler.compileNode(this._right);
    }

    /**
     * Gets the assignment operator.
     *
     * @returns {string}
     */
    get operator() {
        return this._operator;
    }

    /**
     * Gets the left hand of the expression.
     *
     * @returns {PatternInterface|ExpressionInterface}
     */
    get left() {
        return this._left;
    }

    /**
     * Gets the right hand of the expression.
     *
     * @returns {ExpressionInterface}
     */
    get right() {
        return this._right;
    }
}

module.exports = AssignmentExpression;
