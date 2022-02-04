const AST = require('../src/AST');
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

    it ('should compile simple generated expression', () => {
        const compiler = new Compiler(generator);
        const compiled = compiler.compile(new AST.NullLiteral(null));
        expect(compiled).to.be.equal('null');
    })

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

    it ('should correctly compile classes with private members', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
class ClassB {
    #internal;
}

export default class ClassA extends ClassB {
    #internal;
    initialized = false;

    constructor() {
        super();
        this.#internal = 'internal';
    }
}
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(`class ClassB extends __jymfony.JObject {
#internal;
static get [Symbol.reflection]() {
return {
fields: {
"#internal": {
get: (obj) => obj.#internal,set: (obj,value) => obj.#internal = value,docblock: null,},},staticFields: {
},};
}


}
ClassB[Symbol.docblock] = null;
;const ClassA = class ClassA extends ClassB {
#internal;
constructor() {
super();
this.#internal = 'internal';
}

static get [Symbol.reflection]() {
return {
fields: {
"#internal": {
get: (obj) => obj.#internal,set: (obj,value) => obj.#internal = value,docblock: null,},initialized: {
get: (obj) => obj.initialized,set: (obj,value) => obj.initialized = value,docblock: null,},},staticFields: {
},};
}

[Symbol.__jymfony_field_initialization]() {
if (undefined !== super[Symbol.__jymfony_field_initialization]) super[Symbol.__jymfony_field_initialization]()
;
Object.defineProperty(this,"initialized",{
writable: true,enumerable: true,configurable: true,value: false,});
}


}
;
exports.default = ClassA;`);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should handle error stack correctly', __jymfony.version_compare(process.versions.node, '12', '<') ? undefined : () => {
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

    it ('should read and adapt multiple source map', __jymfony.version_compare(process.versions.node, '12', '<') ? undefined : () => {
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

    it ('should compile exports correctly', () => {
        const program = parser.parse(`
export { x, y, z as ɵZ };
`);

        const gen = new Generator({ file: 'x.js' });
        const compiler = new Compiler(gen);
        const compiled = compiler.compile(program);

        expect(compiled.startsWith(
`exports.x = x;
exports.y = y;
exports.ɵZ = z;
`)).to.be.true;
    });
});
