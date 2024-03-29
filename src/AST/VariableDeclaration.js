const DeclarationInterface = require('./DeclarationInterface');
const Function = require('./Function');

class VariableDeclaration extends implementationOf(DeclarationInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {"const"|"let"|"var"} kind
     * @param {VariableDeclarator[]} declarators
     */
    __construct(location, kind, declarators) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {"const"|"let"|"var"}
         *
         * @private
         */
        this._kind = kind;

        /**
         * @type {VariableDeclarator[]}
         *
         * @private
         */
        this._declarators = declarators;

        /**
         * @type {null|string}
         */
        this.docblock = null;
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return true;
    }

    /**
     * Gets the variable declarators.
     *
     * @return {VariableDeclarator[]}
     */
    get declarators() {
        return this._declarators;
    }

    /**
     * Execute preliminary work for node compilation.
     *
     * @param {Compiler} compiler
     */
    prepare(compiler) {
        for (const declarator of this._declarators) {
            declarator.prepare(compiler);
        }
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        if (1 === this._declarators.length) {
            const declarator = this._declarators[0];
            const init = declarator.init;

            if (!! this.docblock) {
                if (init instanceof Function) {
                    init.docblock = this.docblock;
                }
            }
        }

        compiler._emit(this._kind + ' ');
        for (const i in this._declarators) {
            compiler.compileNode(this._declarators[i]);

            if (i != this._declarators.length - 1) {
                compiler._emit(', ');
            }
        }
    }
}

module.exports = VariableDeclaration;
