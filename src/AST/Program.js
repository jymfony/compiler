const BooleanLiteral = require('./BooleanLiteral');
const CallExpression = require('./CallExpression');
const EmptyStatement = require('./EmptyStatement');
const ExpressionStatement = require('./ExpressionStatement');
const Identifier = require('./Identifier');
const { Member } = require('../Generator');
const NodeInterface = require('./NodeInterface');
const ObjectExpression = require('./ObjectExpression');
const ObjectProperty = require('./ObjectProperty');
const StatementInterface = require('./StatementInterface');
const StringLiteral = require('./StringLiteral');

class Program extends implementationOf(NodeInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     */
    __construct(location) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {NodeInterface[]}
         *
         * @private
         */
        this._body = [];

        /**
         * @type {boolean}
         *
         * @private
         */
        this._prepared = false;

        /**
         * @type {boolean}
         */
        this.esModule = false;

        /**
         * @type {(Object|string)[]}
         *
         * @private
         */
        this._sourceMappings = [];
    }

    /**
     * Adds a node.
     *
     * @param {NodeInterface} node
     */
    add(node) {
        if (node instanceof EmptyStatement) {
            return;
        }

        this._body.push(node);
    }

    /**
     * Add source mappings from previous compilation step to current program.
     *
     * @param {...(Object|string)} mappings
     */
    addSourceMappings(...mappings) {
        this._sourceMappings.push(...mappings);
    }

    /**
     * Gets the previous source mappings.
     *
     * @returns {(Object|string)[]}
     */
    get sourceMappings() {
        return [ ...this._sourceMappings ];
    }

    /**
     * Gets the nodes array.
     *
     * @returns {NodeInterface[]}
     */
    get body() {
        return this._body;
    }

    /**
     * Prepares the program body.
     */
    prepare() {
        if (this._prepared) {
            return;
        }

        this._prepared = true;
        if (this.esModule) {
            this._body.unshift(
                new ExpressionStatement(null, new CallExpression(null,
                    Member.create('Object', 'defineProperty'),
                    [
                        new Identifier(null, 'exports'),
                        new StringLiteral(null, '"__esModule"'),
                        new ObjectExpression(null, [
                            new ObjectProperty(null, new Identifier(null, 'value'), new BooleanLiteral(null, true)),
                        ]),
                    ]
                ))
            );
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        for (const node of this._body) {
            compiler.compileNode(node);

            if (! (node instanceof StatementInterface) || node.shouldBeClosed) {
                compiler._emit(';');
                compiler.newLine();
            }
        }
    }
}

module.exports = Program;
