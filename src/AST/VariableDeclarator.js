const { Iife, Variable } = require('../Generator');
const BlockStatement = require('./BlockStatement');
const Identifier = require('./Identifier');
const NodeInterface = require('./NodeInterface');
const ReturnStatement = require('./ReturnStatement');
let Class;

class VariableDeclarator extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {PatternInterface} id
     * @param {ExpressionInterface} init
     */
    __construct(location, id, init = null) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {PatternInterface}
         *
         * @private
         */
        this._id = id;

        /**
         * @type {ExpressionInterface}
         *
         * @private
         */
        this._init = init;
    }

    /**
     * Gets the id.
     *
     * @return {PatternInterface}
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the init value.
     *
     * @returns {ExpressionInterface}
     */
    get init() {
        return this._init;
    }

    /**
     * Execute preliminary work for node compilation.
     *
     * @param {Compiler} compiler
     */
    prepare(compiler) {
        if (null === this._init) {
            return;
        }

        if (undefined === Class) {
            Class = require('./Class');
        }

        if ('function' === typeof this._init.prepare) {
            this._init.prepare(compiler);
        }

        if (this._init instanceof Class) {
            const varDecl = Variable.create('const', this._init.name, this._init);
            varDecl.declarators[0].prepare = () => {};

            this._init = Iife.create(new BlockStatement(null, [
                varDecl,
                new ReturnStatement(null, new Identifier(null, this._init.name)),
            ]));
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        compiler.compileNode(this._id);

        if (null !== this._init) {
            compiler._emit(' = ');
            compiler.compileNode(this._init);
        }
    }
}

module.exports = VariableDeclarator;
