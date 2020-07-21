const Compiler = require('../src/Compiler');
const Generator = require('../src/SourceMap/Generator');
const StackHandler = require('../src/SourceMap/StackHandler');
const Parser = require('../src/Parser');
const { expect } = require('chai');
const { runInNewContext } = require('vm');

describe('[Compiler] Compiler', function () {
    const parser = new Parser();
    const generator = new class extends Generator {
        toString() {
            return '';
        }

        toJSON() {
            return {};
        }
    }();

    it ('should compile assert expressions in debug', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = true;

        try {
            const program = parser.parse('__assert(foo instanceof Foo);');

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal('__assert(foo instanceof Foo);');
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should not compile assert expressions when not in debug', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse('__assert(foo instanceof Foo);');

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(';');
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should handle error stack correctly',  () => {
        const program = parser.parse(`
class x {
    constructor(shouldThrow = false) {
        if (shouldThrow) {
            throw new Error('Has to be thrown');
        }
    }
}

new x();
new x(true);
`);

        const gen = new Generator({ file: 'x.js', skipValidation: true });
        const compiler = new Compiler(gen);

        const compiled = compiler.compile(program);
        StackHandler.registerSourceMap('x.js', gen.toJSON().mappings);

        try {
            runInNewContext(compiled, {}, { filename: 'x.js' });
            throw new Error('FAIL');
        } catch (e) {
            expect(e.stack.startsWith(`x.js:4
throw new Error('Has to be thrown');
^

Has to be thrown

    at new x (x.js:5:18)
    at x.js:11:0`)).to.be.true;
        }
    });

    it ('should read and adapt multiple source map',  () => {
        const program = parser.parse(`class x {
    constructor(shouldThrow = false) {
        if (shouldThrow) {
            throw new Error('Has to be thrown');
        }
    }
}

new x();
new x(true);
`);

        const gen = new Generator({ file: 'x.ts' });
        const compiler = new Compiler(gen);
        const compiled = compiler.compile(program);

        const genStep2 = new Generator({ file: 'x.ts' });
        const compiler2 = new Compiler(genStep2);
        const recompiled = compiler2.compile(parser.parse(compiled));
        StackHandler.registerSourceMap('x.ts', genStep2.toJSON().mappings);

        try {
            runInNewContext(recompiled, {}, { filename: 'x.ts' });
            throw new Error('FAIL');
        } catch (e) {
            expect(e.stack.startsWith(`x.ts:4
throw new Error('Has to be thrown');
^

Has to be thrown

    at new x (x.ts:4:18)
    at x.ts:10:0`)).to.be.true;
        }
    });
});
