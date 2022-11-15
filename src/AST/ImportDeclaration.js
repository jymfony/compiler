const { Member, Variable } = require('../Generator');
const BinaryExpression = require('./BinaryExpression');
const ConditionalExpression = require('./ConditionalExpression');
const Identifier = require('./Identifier');
const ImportDefaultSpecifier = require('./ImportDefaultSpecifier');
const ImportNamespaceSpecifier = require('./ImportNamespaceSpecifier');
const ImportSpecifier = require('./ImportSpecifier');
const ModuleDeclarationInterface = require('./ModuleDeclarationInterface');

class ImportDeclaration extends implementationOf(ModuleDeclarationInterface) {
    /**
     * Constructor.
     *
     * @param {SourceLocation} location
     * @param {ImportSpecifierInterface[]} specifiers
     * @param {Literal} source
     * @param {boolean} optional
     * @param {boolean} nocompile
     */
    __construct(location, specifiers, source, { optional, nocompile } = {}) {
        /**
         * @type {SourceLocation}
         */
        this.location = location;

        /**
         * @type {ImportSpecifierInterface[]}
         *
         * @private
         */
        this._specifiers = specifiers;

        /**
         * @type {Literal}
         *
         * @private
         */
        this._source = source;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._optional = !! optional;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._nocompile = !! nocompile;
    }

    /**
     * @inheritdoc
     */
    prepare() {
        // Do nothing.
    }

    /**
     * @inheritdoc
     */
    get shouldBeClosed() {
        return false;
    }

    /**
     * @inheritdoc
     */
    compile(compiler) {
        const variableName = compiler.generateVariableName();
        compiler._emit('const ' + variableName + ' = ');

        if (this._optional) {
            compiler._emit('(() => { try { return ');
        }

        compiler._emit('require');

        if (this._nocompile) {
            compiler._emit('.nocompile');
        }

        compiler._emit('(');
        compiler.compileNode(this._source);
        compiler._emit(')');

        if (this._optional) {
            compiler._emit('; } catch (e) { ');

            if (1 < this._specifiers.length || this._specifiers[0] instanceof ImportSpecifier) {
                compiler._emit('return {};');
            } else {
                compiler._emit('return undefined;');
            }

            compiler._emit(' } })()');
        }

        compiler._emit(';');
        compiler.newLine();

        for (const specifier of this._specifiers) {
            let right;

            if (specifier instanceof ImportDefaultSpecifier) {
                right = new ConditionalExpression(null,
                    new BinaryExpression(
                        null, '&&',
                        new Identifier(null, variableName),
                        Member.create(variableName, '__esModule')
                    ),
                    Member.create(variableName, 'default'),
                    new Identifier(null, variableName)
                );
            } else if (specifier instanceof ImportNamespaceSpecifier) {
                right = new Identifier(null, variableName);
            } else if (specifier instanceof ImportSpecifier) {
                right = Member.create(variableName, specifier.imported);
            }

            compiler.compileNode(Variable.create('const', specifier.local, right));
            compiler._emit(';');
            compiler.newLine();
        }
    }
}

module.exports = ImportDeclaration;
