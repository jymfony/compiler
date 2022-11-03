const AST = require('../src/AST');
const Compiler = require('../src/Compiler');
const Generator = require('../src/SourceMap/Generator');
const StackHandler = require('../src/SourceMap/StackHandler');
const Parser = require('../src/Parser');
const { expect } = require('chai');
const { runInNewContext } = require('vm');
const seedrandom = require('seedrandom');
const {getNextTypeId} = require('../src/TypeId');

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
            expect(compiled).to.be.equal('__assert(foo instanceof Foo);\n');
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
            expect(compiled).to.be.equal('');
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
            expect(compiled).to.be.equal(`const αa_initialize_class_fields = Symbol();
class ClassB extends __jymfony.JObject {
  #internal;
  static get [Symbol.jymfony_private_accessors]() {
    return {
      fields: {
        "#internal": {
          get: (obj) => obj.#internal,
          set: (obj,value) => obj.#internal = value,
        },
      },
      staticFields: {
      },
      methods: {
      },
      staticMethods: {
      },
    };
  }
  [Symbol.__jymfony_field_initialization]() {
    const superClass = Object.getPrototypeOf(ClassB.prototype);
    const superCall = superClass[Symbol.__jymfony_field_initialization];
    if (undefined !== superClass[Symbol.__jymfony_field_initialization]) 
      superCall.apply(this);
    
    this.#internal = undefined;
  }
  static [αa_initialize_class_fields]() {
    Object.defineProperty(ClassB,Symbol.reflection,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: 390831,
    });
    Object.defineProperty(ClassB,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    Object.defineProperty(ClassB.prototype,Symbol.__jymfony_field_initialization,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: ClassB.prototype[Symbol.__jymfony_field_initialization],
    });
    
  }
}
ClassB[αa_initialize_class_fields]();
const ClassA = (() => {
  const αb_initialize_class_fields = Symbol();
  let ClassA = class ClassA extends ClassB {
    #internal;
    initialized;
    constructor() {
      super();
      this.#internal = 'internal';
      
    }
    static get [Symbol.jymfony_private_accessors]() {
      return {
        fields: {
          "#internal": {
            get: (obj) => obj.#internal,
            set: (obj,value) => obj.#internal = value,
          },
        },
        staticFields: {
        },
        methods: {
        },
        staticMethods: {
        },
      };
    }
    [Symbol.__jymfony_field_initialization]() {
      const superClass = Object.getPrototypeOf(ClassA.prototype);
      const superCall = superClass[Symbol.__jymfony_field_initialization];
      if (undefined !== superClass[Symbol.__jymfony_field_initialization]) 
        superCall.apply(this);
      
      this.#internal = undefined;
      this.initialized = false;
    }
    static [αb_initialize_class_fields]() {
      Object.defineProperty(ClassA,Symbol.reflection,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: 390832,
      });
      Object.defineProperty(ClassA,Symbol.metadata,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: Symbol(),
      });
      Object.defineProperty(ClassA.prototype,Symbol.__jymfony_field_initialization,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: ClassA.prototype[Symbol.__jymfony_field_initialization],
      });
      
    }
  }
  ClassA[αb_initialize_class_fields]();
  ;
  
  return ClassA;
})();
exports.default = ClassA;
`);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should handle error stack correctly', __jymfony.version_compare(process.versions.node, '12', '<') ? (getNextTypeId(), undefined) : () => {
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
            runInNewContext(compiled, { Symbol }, { filename: 'x.js' });
            throw new Error('FAIL');
        } catch (e) {
            expect(e.stack.startsWith(`x.js:5
      throw new Error('Has to be thrown');
      ^

Has to be thrown

    at new x (x.js:5:18)
    at x.js:11:0`)).to.be.true;
        }
    });

    it ('should read and adapt multiple source map', __jymfony.version_compare(process.versions.node, '12', '<') ? undefined : () => {
        const program = parser.parse(`
function x(shouldThrow = false) {
    if (shouldThrow) {
        throw new Error('Has to be thrown');
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
            runInNewContext(recompiled, { Symbol }, { filename: 'x.ts' });
            throw new Error('FAIL');
        } catch (e) {
            expect(e.stack.startsWith(`x.ts:3
    throw new Error('Has to be thrown');
    ^

Has to be thrown

    at new x (x.ts:4:14)
    at x.ts:9:0`)).to.be.true;
        }
    });

    it ('should compile exports correctly', () => {
        const program = parser.parse(`
export { x, y, z as ɵZ };
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);

        expect(compiled).to.be.eq(
`exports.x = x;
exports.y = y;
exports.ɵZ = z;
`);
    });

    it ('should correctly compile if-elses without braces', () => {
        const program = parser.parse(`
function x(er, real) {
  if (!er)
    set[real] = true
  else if (er.syscall === 'stat')
    set[p] = true
  else
    self.emit('error', er) // srsly wtf right here

  if (--n === 0) {
    self.matches[index] = set
    cb()
  }
}
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`function x(er,real) {
  if (! er) 
    set[real] = true;
  else if (er.syscall === 'stat') 
    set[p] = true;
  else self.emit('error',er);
  
  
  if (--n === 0) {
    self.matches[index] = set;
    cb();
    
  }
  
}
`);
    });

    it ('should correctly compile new expressions with anonymous classes', () => {
        seedrandom('anonymous classes', { global: true });
        const program = parser.parse(`
const x = new class {
    getFoo() { }
}();
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`const x = new ((() => {
  const αa_initialize_class_fields = Symbol();
  let _anonymous_xΞ518e6 = class _anonymous_xΞ518e6 extends __jymfony.JObject {
    getFoo() {
      
    }
    static [αa_initialize_class_fields]() {
      Object.defineProperty(_anonymous_xΞ518e6,Symbol.reflection,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: 390834,
      });
      Object.defineProperty(_anonymous_xΞ518e6,Symbol.metadata,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: Symbol(),
      });
      Object.defineProperty(_anonymous_xΞ518e6.prototype.getFoo,Symbol.metadata,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: Symbol(),
      });
      
    }
  }
  _anonymous_xΞ518e6[αa_initialize_class_fields]();
  ;
  
  return _anonymous_xΞ518e6;
})())();
`);
    });
});
