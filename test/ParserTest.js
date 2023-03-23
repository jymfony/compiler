import { dirname, sep } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { compileFunction } from 'vm';
import {getNextTypeId} from '../src/TypeId';

const AST = require('../src/AST');
const ASTComparator = Jymfony.Compiler.Tests.ASTComparator;
const Builder = require('../src/AST/Builder');
const Compiler = require('../src/Compiler');
const NullGenerator = Jymfony.Compiler.Tests.NullGenerator;
const Parser = require('../src/Parser');

const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const IsEqual = Jymfony.Component.Testing.Constraints.IsEqual;

const folder = dirname(require.resolve('test262-parser-tests/package.json'));

const excluded = [
    '06f0deb843fbf358.js', // With statement. Not supported: all the generated code is in strict mode.
    '123285734ee7f954.js', // With statement. Not supported: all the generated code is in strict mode.
    '162fd7b4a7647a1b.js', // With statement. Not supported: all the generated code is in strict mode.
    '1e61843633dcb483.js', // With statement. Not supported: all the generated code is in strict mode.
    '2c4b264884006a8e.js', // With statement. Not supported: all the generated code is in strict mode.
    '2c5f4d039f9c7740.js', // With statement. Not supported: all the generated code is in strict mode.
    '32a9af0615bf7618.js', // With statement. Not supported: all the generated code is in strict mode.
    '3610e596404818d6.js', // With statement. Not supported: all the generated code is in strict mode.
    '3a5a7699f0631c6f.js', // With statement. Not supported: all the generated code is in strict mode.
    '5239dd0fc0effb71.js', // With statement. Not supported: all the generated code is in strict mode.
    '5333f04581124314.js', // With statement. Not supported: all the generated code is in strict mode.
    '55c15fe174790fb2.js', // With statement. Not supported: all the generated code is in strict mode.
    '560c364700fdb6b2.js', // With statement. Not supported: all the generated code is in strict mode.
    '5aca2791ab698851.js', // With statement. Not supported: all the generated code is in strict mode.
    '5d9d30af901ba176.js', // With statement. Not supported: all the generated code is in strict mode.
    '6b0e8bbdc3dca1c5.js', // With statement. Not supported: all the generated code is in strict mode.
    '7d8b61ba2a3a275c.js', // With statement. Not supported: all the generated code is in strict mode.
    '855b8dea36c841ed.js', // With statement. Not supported: all the generated code is in strict mode.
    '90fa9751ab71ce28.js', // With statement. Not supported: all the generated code is in strict mode.
    '927b1e0dd52248a6.js', // With statement. Not supported: all the generated code is in strict mode.
    '93d4c5dfbddf859d.js', // With statement. Not supported: all the generated code is in strict mode.
    '96ea36bc180f25d5.js', // With statement. Not supported: all the generated code is in strict mode.
    'a10929d2c1b0d792.js', // With statement. Not supported: all the generated code is in strict mode.
    'a2f26b79b01628f9.js', // With statement. Not supported: all the generated code is in strict mode.
    'ac73bc36bbc48890.js', // With statement. Not supported: all the generated code is in strict mode.
    'a41e5072dd6dda98.js', // With statement. Not supported: all the generated code is in strict mode.
    'a42a93f3af33bbc5.js', // With statement. Not supported: all the generated code is in strict mode.
    'afcf8bace3839da2.js', // With statement. Not supported: all the generated code is in strict mode.
    'b8705496c9c1ff60.js', // With statement. Not supported: all the generated code is in strict mode.
    'bd883e5fd1f09b69.js', // With statement. Not supported: all the generated code is in strict mode.
    'be2fd5888f434cbd.js', // With statement. Not supported: all the generated code is in strict mode.
    'cb625ce2970fe52a.js', // With statement. Not supported: all the generated code is in strict mode.
    'cf939dae739eacf6.js', // With statement. Not supported: all the generated code is in strict mode.
    'd88992e07614f506.js', // With statement. Not supported: all the generated code is in strict mode.
    'f658dbaa20c36388.js', // With statement. Not supported: all the generated code is in strict mode.
    '14199f22a45c7e30.js', // "let" as identifier. Not supported: let is reserved word in ES6
    '2ef5ba0343d739dc.js', // "let" as identifier. Not supported: let is reserved word in ES6
    '5654d4106d7025c2.js', // "let" as identifier. Not supported: let is reserved word in ES6
    '56e2ba90e05f5659.js', // "let" as identifier. Not supported: let is reserved word in ES6
    '6815ab22de966de8.js', // "let" as identifier. Not supported: let is reserved word in ES6
    '6b36b5ad4f3ad84d.js', // "let" as identifier. Not supported: let is reserved word in ES6
    '9aa93e1e417ce8e3.js', // "let" as identifier. Not supported: let is reserved word in ES6
    '9fe1d41db318afba.js', // "let" as identifier. Not supported: let is reserved word in ES6
    'c442dc81201e2b55.js', // "let" as identifier. Not supported: let is reserved word in ES6
    'df696c501125c86f.js', // "let" as identifier. Not supported: let is reserved word in ES6
    'ee4e8fa6257d810a.js', // "let" as identifier. Not supported: let is reserved word in ES6
    'f0d9a7a2f5d42210.js', // "let" as identifier. Not supported: let is reserved word in ES6
    'ffaf5b9d3140465b.js', // "let" as identifier. Not supported: let is reserved word in ES6
    'd22f8660531e1c1a.js', // "static" as identifier. Not supported: static is reserved word in ES6
    'f4a61fcdefebb9d4.js', // "private", "protected", "public" as identifier. Not supported: reserved words in ES6
    '48567b651f81277e.js', // Duplicate __proto__ fields are not allowed in object literals
    '802658d6ef9a83ec.js', // Duplicate __proto__ fields are not allowed in object literals
];

export default class ParserTest extends TestCase {
    /**
     * @type {Parser}
     * @private
     */
    _parser;

    /**
     * @type {NullGenerator}
     *
     * @private
     */
    _sourceMapGenerator;

    get testCaseName() {
        return '[Compiler] ' + super.testCaseName;
    }

    before() {
        this._sourceMapGenerator = new NullGenerator();
    }

    after() {
        this._sourceMapGenerator.free();
    }

    beforeEach() {
        this._parser = new Parser();
    }

    assertSameAST(expected, actual, message = null) {
        if (expected instanceof Builder) {
            expected = expected._children;
        } else if (expected instanceof AST.Program) {
            expected = expected.body;
        }

        if (actual instanceof Builder) {
            actual = actual._children;
        } else if (actual instanceof AST.Program) {
            actual = actual.body;
        }

        const constraint = new IsEqual(expected);
        const factory = constraint.comparatorFactory;
        factory.register(new ASTComparator(factory));

        __self.assertThat(actual, constraint, message);
    }

    * provide262Tests() {
        for (const filename of readdirSync(folder + sep + 'pass')) {
            if (excluded.includes(filename)) {
                continue;
            }

            yield [ filename ];
        }
    }

    @dataProvider('provide262Tests')
    testShouldPass262Test(filename) {
        this.setTitle('should pass ' + filename + ' test');
        const fn = folder + sep + 'pass' + sep + filename;

        const content = readFileSync(fn, { encoding: 'utf-8' });
        const program = this._parser.parse(content);

        const compiler = new Compiler(this._sourceMapGenerator);
        const compiled = compiler.compile(program);

        __self.assertNotNull(program);
        compileFunction(compiled);
    }

    testShouldCorrectlyParseDoWhileWithoutBlock() {
        const program = this._parser.parse(`
        do
            things()
        while (a > 0);
`);

        __self.assertCount(1, program.body);

        const builder = new Builder();
        builder
            .do()
                .test()
                    .binary()
                        .operator('>')
                        .left().ident('a').end()
                        .right().number(0).end()
                    .end()
                .end()
                .call()
                    .callee()
                        .ident('things').end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseGetAndSetAsIdentifier() {
        const program = this._parser.parse(`
        function t() {
            obj.get('foo');
            set(obj, 'bar');
        }
`);

        const builder = new Builder();
        builder
            .function()
                .name().ident('t').end()
                .block()
                    .call()
                        .callee().member('obj', 'get').end()
                        .string('\'foo\'')
                    .end()
                    .call()
                        .callee().ident('set').end()
                        .ident('obj')
                        .string('\'bar\'')
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParsePostfixUpdateAfterSpace() {
        const program = this._parser.parse('i ++;');

        const builder = new Builder();
        builder
            .update()
                .postfix()
                .operator('++')
                .ident('i')
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseVariableInitAssignment() {
        const program = this._parser.parse('var u=-1');

        const builder = new Builder();
        builder
            .variable('var')
                .declarator('u')
                    .unary('-').number(1).end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseMultipleInitAssignments() {
        const program = this._parser.parse('function r(n,t){for(var r=-1,e=null==n?0:n.length;++r<e&&false!==t(n[r],r,n););return n}');

        const builder = new Builder();
        builder
            .function()
                .name().ident('r').end()
                .argument().name('n').end()
                .argument().name('t').end()
                .block()
                    .for()
                        .init()
                            .variable('var')
                                .declarator('r')
                                    .unary('-')
                                        .number(1)
                                    .end()
                                .end()
                                .declarator('e')
                                    .conditional()
                                        .test()
                                            .binary()
                                                .operator('==')
                                                .left().null().end()
                                                .right().ident('n').end()
                                            .end()
                                        .end()
                                        .consequent()
                                            .number(0)
                                        .end()
                                        .alternate()
                                            .member('n', 'length')
                                        .end()
                                    .end()
                                .end()
                            .end()
                        .end()
                        .test()
                            .binary()
                                .operator('&&')
                                .left()
                                    .binary()
                                        .operator('<')
                                        .left()
                                            .update().operator('++').ident('r').prefix().end()
                                        .end()
                                        .right().ident('e').end()
                                    .end()
                                .end()
                                .right()
                                    .binary()
                                        .operator('!==')
                                        .left().false().end()
                                        .right().call()
                                            .callee().ident('t').end()
                                            .member('n', '[r]')
                                            .ident('r')
                                            .ident('n')
                                        .end().end()
                                    .end()
                                .end()
                            .end()
                        .end()
                    .end()
                    .return()
                        .ident('n')
                    .end()
                .end()
            .end()
        ;

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseImportWithoutSemicolons() {
        const program = this._parser.parse(`import { Inject } from '@jymfony/decorators'
import { Client } from 'non-existent-package'
`);

        const builder = new Builder();
        builder
            .import('\'@jymfony/decorators\'')
                .specifier('Inject')
            .end()
            .import('\'non-existent-package\'')
                .specifier('Client')
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseOptionalImports() {
        const program = this._parser.parse(`import { Inject } from '@jymfony/decorators';
import { Client } from 'non-existent-package' optional;

export default () => {
    return [ Inject !== undefined, Client === undefined ];
};
`);

        const builder = new Builder();
        builder
            .import('\'@jymfony/decorators\'')
                .specifier('Inject')
            .end()
            .import('\'non-existent-package\'')
                .specifier('Client')
                .optional()
            .end()
            .exportDefault()
                .arrowFunction()
                    .block()
                        .return()
                            .array()
                                .binary()
                                    .operator('!==')
                                    .left().ident('Inject').end()
                                    .right().ident('undefined').end()
                                .end()
                                .binary()
                                    .operator('===')
                                    .left().ident('Client').end()
                                    .right().ident('undefined').end()
                                .end()
                            .end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseMultipleImportFlags() {
        const program = this._parser.parse(`import { Inject } from '@jymfony/decorators';
import { Client } from 'non-existent-package' nocompile optional;

export default () => {
    return [ Inject !== undefined, Client === undefined ];
};
`);

        const builder = new Builder();
        builder
            .import('\'@jymfony/decorators\'')
                .specifier('Inject')
            .end()
            .import('\'non-existent-package\'')
                .specifier('Client')
                .optional()
                .nocompile()
            .end()
            .exportDefault()
                .arrowFunction()
                    .block()
                        .return()
                            .array()
                                .binary()
                                    .operator('!==')
                                    .left().ident('Inject').end()
                                    .right().ident('undefined').end()
                                .end()
                                .binary()
                                    .operator('===')
                                    .left().ident('Client').end()
                                    .right().ident('undefined').end()
                                .end()
                            .end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldParseVariableInterpolationCorrectly() {
        const program = this._parser.parse('!indentfirst ? `${l}\\n` : `${sp}${l}\\n`;');

        const builder = new Builder();
        builder
            .conditional()
                .test()
                    .unary('!').ident('indentfirst').end()
                .end()
                .consequent()
                    .string('`${l}\\n`')
                .end()
                .alternate()
                    .string('`${sp}${l}\\n`')
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldParseJsOptionalChaining() {
        const program = this._parser.parse('a?.prop1?.[prop2]');
        const builder = new Builder();
        builder
            .member('a', '?prop1', '?[prop2]');

        this.assertSameAST(builder, program);
    }

    testShouldParseJsOptionalChainingWithCall() {
        const program = this._parser.parse('a?.prop1?.(\'test\')');
        const builder = new Builder();
        builder
            .call()
                .callee()
                    .member('a', '?prop1')
                .end()
                .optional()
                .string('\'test\'')
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldParseNullCoalescingOpeartor() {
        const program = this._parser.parse('obj?.response?.html?.enabled ?? retval.response.html.enabled');
        const builder = new Builder();
        builder
            .binary()
                .operator('??')
                .left().member('obj', '?response', '?html', '?enabled').end()
                .right().member('retval', 'response', 'html', 'enabled').end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldParseConsecutiveCommasInArrays() {
        const program = this._parser.parse('[ 1, , 3, 4 ]');

        const builder = new Builder();
        builder
            .array()
                .number(1)
                .empty()
                .number(3)
                .number(4)
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldParseSpreadOperatorInObjectUnpacking() {
        const program = this._parser.parse('const { g, ...x } = { g: \'foo\', y: \'test\', p: 123 }');

        const builder = new Builder();
        builder
            .variable('const')
                .declarator(
                    new Builder(null, true)
                        .pattern().object()
                            .property()
                                .key().ident('g').end()
                            .end()
                            .spread().ident('x').end()
                        .end().end()
                    .end()[0]
                )
                    .object()
                        .property()
                            .key().ident('g').end()
                            .value().string('\'foo\'').end()
                        .end()
                        .property()
                            .key().ident('y').end()
                            .value().string('\'test\'').end()
                        .end()
                        .property()
                            .key().ident('p').end()
                            .value().number(123).end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldParseXorOperatorCorrectly() {
        const program = this._parser.parse('function op_xor(x,y) { return x^y; }');

        const builder = new Builder();
        builder
            .function()
                .name().ident('op_xor').end()
                .argument().name('x').end()
                .argument().name('y').end()
                .block()
                    .return()
                        .binary()
                            .operator('^')
                            .left().ident('x').end()
                            .right().ident('y').end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldParseAsyncAsVariableIdentifier() {
        const program = this._parser.parse(`
var async = require('./lib/async');
async.core = core;
async.isCore = function isCore(x) { return core[x]; };
`);

        const builder = new Builder();
        builder
            .variable('var')
                .declarator('async')
                    .call()
                        .callee().ident('require').end()
                        .string('\'./lib/async\'')
                    .end()
                .end()
            .end()
            .assign()
                .left().member('async', 'core').end()
                .right().ident('core').end()
            .end()
            .assign()
                .left().member('async', 'isCore').end()
                .right()
                    .function()
                        .name().ident('isCore').end()
                        .argument().name('x').end()
                        .block()
                            .return()
                                .member('core', '[x]')
                            .end()
                        .end()
                    .end()
                .end()
            .end()

        this.assertSameAST(builder, program);
    }

    testShouldParseBreakWithNewlineAndIdentifierNext() {
        const program = this._parser.parse(`
  for (var i = released.length - 1; i >= 0; i--) {
    if (minimum > getMajor(released[i])) break
    selected.unshift(released[i])
  }
`);

        const builder = new Builder();
        builder
            .for()
                .init()
                    .variable('var')
                        .declarator('i')
                            .binary()
                                .operator('-')
                                .left().member('released', 'length').end()
                                .right().number(1).end()
                            .end()
                        .end()
                    .end()
                .end()
                .test()
                    .binary()
                        .operator('>=')
                        .left().ident('i').end()
                        .right().number(0).end()
                    .end()
                .end()
                .update()
                    .update()
                        .postfix()
                        .operator('--')
                        .ident('i')
                    .end()
                .end()
                .block()
                    .if()
                        .test()
                            .binary()
                                .operator('>')
                                .left().ident('minimum').end()
                                .right()
                                    .call()
                                        .callee().ident('getMajor').end()
                                        .member('released', '[i]')
                                    .end()
                                .end()
                            .end()
                        .end()
                        .consequent().break().end()
                    .end()
                    .call()
                        .callee().member('selected', 'unshift').end()
                        .member('released', '[i]')
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyRescanTheRestOfTheFileIfAWrongRegexHasBeenMatched() {
        const program = this._parser.parse(`
const foo = cond ? Number(bar) / 100 : undefined; // return a comment
`);

        const builder = new Builder();
        builder
            .variable('const')
                .declarator('foo')
                    .conditional()
                        .test().ident('cond').end()
                        .consequent()
                            .binary()
                                .operator('/')
                                .left()
                                    .call()
                                        .callee().ident('Number').end()
                                        .ident('bar')
                                    .end()
                                .end()
                                .right().number(100).end()
                            .end()
                        .end()
                        .alternate().ident('undefined').end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldParseComposedKeyInLiteralObject() {
        const program = this._parser.parse('const a = {[k]: env = defaultEnv};');

        const builder = new Builder();
        builder
            .variable('const')
                .declarator('a')
                    .object()
                        .property()
                            .key().string('k').end()
                            .value()
                                .assign()
                                    .left().ident('env').end()
                                    .right().ident('defaultEnv').end()
                                .end()
                            .end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyRethrowARescanThroughTheCallChain() {
        const program = this._parser.parse(`
[rgbR, rgbG, rgbB].map(function xmap(v) {
    return v > 4.045 ? Math.pow((v + 5.5) / 105.5, 2.4) * 100 : v / 12.92;
});
`);

        const builder = new Builder();
        builder
            .call()
                .callee()
                    .member(
                        new Builder(null, true)
                            .array()
                                .ident('rgbR')
                                .ident('rgbG')
                                .ident('rgbB')
                            .end()
                        .end()[0],
                        'map'
                    )
                .end()
                .function()
                    .name().ident('xmap').end()
                    .argument().name('v').end()
                    .block()
                        .return()
                            .conditional()
                                .test()
                                    .binary()
                                        .operator('>')
                                        .left().ident('v').end()
                                        .right().number(4.045).end()
                                    .end()
                                .end()
                                .consequent()
                                    .binary()
                                        .operator('*')
                                        .right().number(100).end()
                                        .left()
                                            .call()
                                                .callee().member('Math', 'pow').end()
                                                .binary()
                                                    .operator('/')
                                                    .right().number(105.5).end()
                                                    .left()
                                                        .parens()
                                                            .binary()
                                                                .operator('+')
                                                                .left().ident('v').end()
                                                                .right().number(5.5).end()
                                                            .end()
                                                        .end()
                                                    .end()
                                                .end()
                                                .number(2.4)
                                            .end()
                                        .end()
                                    .end()
                                .end()
                                .alternate()
                                    .binary()
                                        .operator('/')
                                        .left().ident('v').end()
                                        .right().number(12.92).end()
                                    .end()
                                .end()
                            .end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyRescanMultipleTimes() {
        const program = this._parser.parse(`
convert.apple.rgb = function rgb(apple) {
    return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function apple(rgb) {
    return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function gray(args) {
    return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};
`);

        let builder = new Builder();
        builder
            .assign()
                .left().member('convert', 'apple', 'rgb').end()
                .right()
                    .function()
                        .name().ident('rgb').end()
                        .argument().name('apple').end()
                        .block()
                            .return()
                                .array()
                                    .binary()
                                        .operator('*')
                                        .right().number(255).end()
                                        .left()
                                            .parens()
                                                .binary()
                                                    .operator('/')
                                                    .left().member('apple', '[0]').end()
                                                    .right().number(65535).end()
                                                .end()
                                            .end()
                                        .end()
                                    .end()
                                    .binary()
                                        .operator('*')
                                        .right().number(255).end()
                                        .left()
                                            .parens()
                                                .binary()
                                                    .operator('/')
                                                    .left().member('apple', '[1]').end()
                                                    .right().number(65535).end()
                                                .end()
                                            .end()
                                        .end()
                                    .end()
                                    .binary()
                                        .operator('*')
                                        .right().number(255).end()
                                        .left()
                                            .parens()
                                                .binary()
                                                    .operator('/')
                                                    .left().member('apple', '[2]').end()
                                                    .right().number(65535).end()
                                                .end()
                                            .end()
                                        .end()
                                    .end()
                                .end()
                            .end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder.end()[0], program.body[0]);

        builder = new Builder();
        builder
            .assign()
                .left().member('convert', 'rgb', 'apple').end()
                .right()
                    .function()
                        .name().ident('apple').end()
                        .argument().name('rgb').end()
                        .block()
                            .return()
                                .array()
                                    .binary()
                                        .operator('*')
                                        .right().number(65535).end()
                                        .left()
                                            .parens()
                                                .binary()
                                                    .operator('/')
                                                    .left().member('rgb', '[0]').end()
                                                    .right().number(255).end()
                                                .end()
                                            .end()
                                        .end()
                                    .end()
                                    .binary()
                                        .operator('*')
                                        .right().number(65535).end()
                                        .left()
                                            .parens()
                                                .binary()
                                                    .operator('/')
                                                    .left().member('rgb', '[1]').end()
                                                    .right().number(255).end()
                                                .end()
                                            .end()
                                        .end()
                                    .end()
                                    .binary()
                                        .operator('*')
                                        .right().number(65535).end()
                                        .left()
                                            .parens()
                                                .binary()
                                                    .operator('/')
                                                    .left().member('rgb', '[2]').end()
                                                    .right().number(255).end()
                                                .end()
                                            .end()
                                        .end()
                                    .end()
                                .end()
                            .end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder.end()[0], program.body[1]);

        builder = new Builder();
        builder
            .assign()
                .left().member('convert', 'gray', 'rgb').end()
                .right()
                    .function()
                        .name().ident('gray').end()
                        .argument().name('args').end()
                        .block()
                            .return()
                                .array()
                                    .binary()
                                        .operator('/')
                                        .left().member('args', '[0]').end()
                                        .right()
                                            .binary()
                                                .operator('*')
                                                .left().number(100).end()
                                                .right().number(255).end()
                                            .end()
                                        .end()
                                    .end()
                                    .binary()
                                        .operator('/')
                                        .left().member('args', '[0]').end()
                                        .right()
                                            .binary()
                                                .operator('*')
                                                .left().number(100).end()
                                                .right().number(255).end()
                                            .end()
                                        .end()
                                    .end()
                                    .binary()
                                        .operator('/')
                                        .left().member('args', '[0]').end()
                                        .right()
                                            .binary()
                                                .operator('*')
                                                .left().number(100).end()
                                                .right().number(255).end()
                                            .end()
                                        .end()
                                    .end()
                                .end()
                            .end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder.end()[0], program.body[2]);
    }

    testShouldCorrectlySplitKeywordAndStringOperator() {
        const program = this._parser.parse(`
switch(c){case'\\t':read();return;}
`);

        const builder = new Builder();
        builder
            .switch()
                .discriminant().ident('c').end()
                .case()
                    .test().string('\'\\t\'').end()
                    .call()
                        .callee().ident('read').end()
                    .end()
                    .return().end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseYieldExpressionAssignment() {
        const program = this._parser.parse('result = yield transform(source, options);');

        const builder = new Builder();
        builder
            .assign()
                .left().ident('result').end()
                .right()
                    .yield()
                        .call()
                            .callee().ident('transform').end()
                            .ident('source')
                            .ident('options')
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseComputedClassMemberId() {
        const program = this._parser.parse(`
class x {
  [computed](param) {}
}
`);

        const builder = new Builder();
        builder
            .class()
                .id('x')
                .method()
                    .name().string('computed').end()
                    .argument().name('param').end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }
    testShouldCorrectlyParseInstanceFields() {
        const program = this._parser.parse(`
class x {
  field = 'foo';
  #priv;
}
`);

        const builder = new Builder();
        builder
            .class()
                .id('x')
                .property()
                    .key().ident('field').end()
                    .value().string('\'foo\'').end()
                .end()
                .property()
                    .private()
                    .key().ident('priv').end()
                .end()
            .end()

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseBigintNotation() {
        const program = this._parser.parse(`
const x = 1n;
`);

        const builder = new Builder();
        builder
            .variable('const')
                .declarator('x')
                    .number(1n)
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldStripShebangDirectiveFromParsedCode() {
        const program = this._parser.parse(`#!/usr/bin/env node

const module = require('module');
console.log(module);
`);

        const builder = new Builder();
        builder
            .variable('const')
                .declarator('module')
                    .call()
                        .callee().ident('require').end()
                        .string('\'module\'')
                    .end()
                .end()
            .end()
            .call()
                .callee().member('console', 'log').end()
                .ident('module')
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseKeywordsInIncorrectContext() {
        const program = this._parser.parse(`
const let = 'a let identifier';
const const = 'a const identifier';
const async = 'this is a string';
if (async === null) {
    debugger;
}
`);

        const builder = new Builder();
        builder
            .variable('const')
                .declarator('let')
                    .string('\'a let identifier\'')
                .end()
            .end()
            .variable('const')
                .declarator('const')
                    .string('\'a const identifier\'')
                .end()
            .end()
            .variable('const')
                .declarator('async')
                    .string('\'this is a string\'')
                .end()
            .end()
            .if()
                .test()
                    .binary()
                        .operator('===')
                        .left().ident('async').end()
                        .right().null().end()
                    .end()
                .end()
                .consequent()
                    .block()
                        .debugger()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseExpressionsWithACommentInTheMiddle() {
        const program = this._parser.parse(`
a.b('.x', Y)
    .setA() // comment
    .setB();
`);

        const builder = new Builder();
        builder
            .call()
                .callee()
                    .member(
                        new Builder(null, true)
                            .call()
                                .callee()
                                    .member(
                                        new Builder(null, true)
                                            .call()
                                                .callee().member('a', 'b').end()
                                                .string('\'.x\'')
                                                .ident('Y')
                                            .end()
                                        .end()[0],
                                        'setA'
                                    )
                                .end()
                            .end()
                        .end()[0],
                        'setB'
                    )
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseExpressionsWithACommentInTheMiddle2() {
        const program = this._parser.parse(`
val =
  val === 0 && 1 / val === -Infinity // -0
    ? '-0'
    : val.toString();
`);

        const builder = new Builder();
        builder
            .assign()
                .left().ident('val').end()
                .right()
                    .conditional()
                        .test()
                            .binary()
                                .operator('&&')
                                .left()
                                    .binary()
                                        .operator('===')
                                        .left().ident('val').end()
                                        .right().number(0).end()
                                    .end()
                                .end()
                                .right()
                                    .binary()
                                        .operator('===')
                                        .left()
                                            .binary()
                                                .operator('/')
                                                .left().number(1).end()
                                                .right().ident('val').end()
                                            .end()
                                        .end()
                                        .right().unary('-').ident('Infinity').end().end()
                                    .end()
                                .end()
                            .end()
                        .end()
                        .consequent().string('\'-0\'').end()
                        .alternate()
                            .call()
                                .callee().member('val', 'toString').end()
                            .end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseExpressionsWithACommentInTheMiddle3() {
        const program = this._parser.parse(`
  x = false

  // this is a comment
  var n = this.length
`);

        const builder = new Builder();
        builder
            .assign()
                .left().ident('x').end()
                .right().false().end()
            .end()
            .variable('var')
                .declarator('n')
                    .member('this', 'length')
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseExpressionsWithACommentInTheMiddle4() {
        const program = this._parser.parse(`
  [
    'x',
    'y' // this is the second element
    // and this is a comment
  ].forEach(opt => {
    this[opt]();
  });
`);

        const builder = new Builder();
        builder
            .call()
                .callee()
                    .member(
                        new Builder(null, true)
                            .array()
                                .string('\'x\'')
                                .string('\'y\'')
                            .end()
                        .end()[0],
                        'forEach'
                    )
                .end()
                .arrowFunction()
                    .argument().name('opt').end()
                    .block()
                        .call()
                            .callee()
                                .member('this', '[opt]')
                            .end()
                        .end()
                    .end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseExpressionsWithACommentInTheMiddle5() {
        const program = this._parser.parse(`
for (;;) {
  switch(x) {
    default: console.log(1);
  } // end switch
} // end for
`);

        const builder = new Builder();
        builder
            .for()
                .block()
                    .switch()
                        .discriminant().ident('x').end()
                        .case()
                            .call()
                                .callee().member('console', 'log').end()
                                .number(1)
                            .end()
                        .end()
                    .end()
                    .empty()
                .end()
            .end()

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseIfExpressionsWithLineTerminations() {
        const program = this._parser.parse(`
if (
  err.code !== 'MODULE_NOT_FOUND' ||
  err.message.indexOf('Cannot find module') !== -1
) {
}
`);

        const builder = new Builder();
        builder
            .if()
                .test()
                    .binary()
                        .operator('||')
                        .left()
                            .binary()
                                .operator('!==')
                                .left().member('err', 'code').end()
                                .right().string('\'MODULE_NOT_FOUND\'').end()
                            .end()
                        .end()
                        .right()
                            .binary()
                                .operator('!==')
                                .left()
                                    .call()
                                        .callee().member('err', 'message', 'indexOf').end()
                                        .string('\'Cannot find module\'')
                                    .end()
                                .end()
                                .right().unary('-').number(1).end().end()
                            .end()
                        .end()
                    .end()
                .end()
                .consequent()
                    .block().end()
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseConditionalExpressionsWithLineTerminations() {
        const program = this._parser.parse(`
_err.code !== 'MODULE_NOT_FOUND' ||
_err.message.indexOf('Cannot find module') !== -1
  ? x
  : y;
`);

        const builder = new Builder();
        builder
            .conditional()
                .test()
                    .binary()
                        .operator('||')
                        .left()
                            .binary()
                                .operator('!==')
                                .left().member('_err', 'code').end()
                                .right().string('\'MODULE_NOT_FOUND\'').end()
                            .end()
                        .end()
                        .right()
                            .binary()
                                .operator('!==')
                                .left()
                                    .call()
                                        .callee().member('_err', 'message', 'indexOf').end()
                                        .string('\'Cannot find module\'')
                                    .end()
                                .end()
                                .right().unary('-').number(1).end().end()
                            .end()
                        .end()
                    .end()
                .end()
                .consequent().ident('x').end()
                .alternate().ident('y').end()
            .end();

        this.assertSameAST(builder, program);
    }

    testShouldCorrectlyParseIfExpressionsWithLineTerminations3() {
        const program = this._parser.parse(`
  if (code >= 97) { } // a
  else if (code >= 65) { } // A
  else if (code >= 48 && code <= 57) { } // 0-9
  else { }
`);

        const builder = new Builder();
        builder
            .if()
                .test()
                    .binary()
                        .operator('>=')
                        .left().ident('code').end()
                        .right().number(97).end()
                    .end()
                .end()
                .consequent().block().end().end()
                .alternate().if()
                    .test()
                        .binary()
                            .operator('>=')
                            .left().ident('code').end()
                            .right().number(65).end()
                        .end()
                    .end()
                    .consequent().block().end().end()
                    .alternate().if()
                        .test()
                            .binary()
                                .operator('&&')
                                .left()
                                    .binary()
                                        .operator('>=')
                                        .left().ident('code').end()
                                        .right().number(48).end()
                                    .end()
                                .end()
                                .right()
                                    .binary()
                                        .operator('<=')
                                        .left().ident('code').end()
                                        .right().number(57).end()
                                    .end()
                                .end()
                            .end()
                        .end()
                        .consequent().block().end().end()
                        .alternate().block().end().end()
                    .end().end()
                .end().end()
            .end()

        this.assertSameAST(builder, program);
    }

    testAsyncUsedAsIdentifier() {
        const program = this._parser.parse(`
  // send back results we have so far
  async(callback)(null, this.results);
`);

        const builder = new Builder();
        builder
            .call()
                .callee()
                    .call()
                        .callee().ident('async').end()
                        .ident('callback')
                    .end()
                .end()
                .null()
                .member('this', 'results')
            .end();

        this.assertSameAST(builder, program);
    }

    testAsyncUsedAsIdentifier2() {
        const program = this._parser.parse('let async = "test";');

        const builder = new Builder();
        builder
            .variable('let')
                .declarator('async')
                    .string('"test"')
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testAsyncUsedAsIdentifier3() {
        const program = this._parser.parse(`
let async = "test";
async.toUpperCase();
`);
        const builder = new Builder();
        builder
            .variable('let')
                .declarator('async')
                    .string('"test"')
                .end()
            .end()
            .call()
                .callee()
                    .member('async', 'toUpperCase')
                .end()
            .end();

        this.assertSameAST(builder, program);
    }

    testAsyncUsedAsIdentifier4() {
        const program = this._parser.parse('this.async.toUpperCase();');

        const builder = new Builder();
        builder
            .call()
                .callee()
                    .member('this', 'async', 'toUpperCase')
                .end()
            .end();

        this.assertSameAST(builder, program);
    }
}
