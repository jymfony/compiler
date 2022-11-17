const AST = require('../src/AST');
const Compiler = require('../src/Compiler');
const Generator = require('../src/SourceMap/Generator');
const StackHandler = require('../src/SourceMap/StackHandler');
const Parser = require('../src/Parser');
const { expect } = require('chai');
const { runInNewContext, runInThisContext } = require('vm');
const seedrandom = require('seedrandom');

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
            expect(compiled).to.be.equal(`Object.defineProperty(exports,"__esModule",{
  value: true,
});
const αa_initialize_class_fields = Symbol();
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
    
  }
}
ClassB[αa_initialize_class_fields]();
const αb_initialize_class_fields = Symbol();
const ClassA = (() => {
  const ClassA = class ClassA extends ClassB {
    #internal;
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
            runInNewContext(compiled, { Symbol, __jymfony }, { filename: 'x.js' });
            throw new Error('FAIL');
        } catch (e) {
            expect(e.stack.startsWith(`x.js:6
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
`Object.defineProperty(exports,"__esModule",{
  value: true,
});
exports.x = x;
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
  const _anonymous_xΞ518e6 = (() => {
    const _anonymous_xΞ518e6 = class _anonymous_xΞ518e6 extends __jymfony.JObject {
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
  })();
  return _anonymous_xΞ518e6;
})())();
`);
    });

    it ('should correctly compile classes with auto-accessors', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
export default class Foo {
    accessor internal;
}
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(`Object.defineProperty(exports,"__esModule",{
  value: true,
});
const αa_initialize_class_fields = Symbol();
const αb_Foo_accessor_internalΞ9b38b = Symbol(), αb_Foo_accessor_internalΞ9b38b_init = [  ];
const Foo = (() => {
  const Foo = class Foo extends __jymfony.JObject {
    
    get internal() {
      return this[αb_Foo_accessor_internalΞ9b38b];
    }
    set internal(value) {
      this[αb_Foo_accessor_internalΞ9b38b] = value;
    }
    [Symbol.__jymfony_field_initialization]() {
      const superClass = Object.getPrototypeOf(Foo.prototype);
      const superCall = superClass[Symbol.__jymfony_field_initialization];
      if (undefined !== superClass[Symbol.__jymfony_field_initialization]) 
        superCall.apply(this);
      
      this[αb_Foo_accessor_internalΞ9b38b] = (() => undefined)();
    }
    static [αa_initialize_class_fields]() {
      Object.defineProperty(Foo,Symbol.reflection,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: 390835,
      });
      Object.defineProperty(Foo,Symbol.metadata,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: Symbol(),
      });
      Object.defineProperty(Object.getOwnPropertyDescriptor(Foo.prototype,"internal").get,Symbol.metadata,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: Symbol(),
      });
      Object.defineProperty(Object.getOwnPropertyDescriptor(Foo.prototype,"internal").set,Symbol.metadata,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: Symbol(),
      });
      Object.defineProperty(Foo.prototype,Symbol.__jymfony_field_initialization,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: Foo.prototype[Symbol.__jymfony_field_initialization],
      });
      
    }
  }
  Foo[αa_initialize_class_fields]();
  ;
  return Foo;
})();
exports.default = Foo;
`);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should correctly compile anonymous classes in parenthesized expression', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
const x = new (class extends GenericRetryStrategy {
    methodX() {
    }
})(0);

module.exports = x;
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(`const x = new ((() => {
  const αa_initialize_class_fields = Symbol();
  const _anonymous_xΞ5c6f0 = (() => {
    const _anonymous_xΞ5c6f0 = class _anonymous_xΞ5c6f0 extends GenericRetryStrategy {
      methodX() {
        
      }
      
      static [αa_initialize_class_fields]() {
        Object.defineProperty(_anonymous_xΞ5c6f0,Symbol.reflection,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: 390836,
        });
        Object.defineProperty(_anonymous_xΞ5c6f0,Symbol.metadata,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: Symbol(),
        });
        Object.defineProperty(_anonymous_xΞ5c6f0.prototype.methodX,Symbol.metadata,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: Symbol(),
        });
        
      }
    }
    _anonymous_xΞ5c6f0[αa_initialize_class_fields]();
    ;
    return _anonymous_xΞ5c6f0;
  })();
  return _anonymous_xΞ5c6f0;
})())(0);
module.exports = x;
`);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should correctly compile anonymous classes in variable declarators', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
export default class ScopingHttpClientTest extends TestCase {
    @dataProvider('provideMatchingUrls')
    async testMatchingUrls(regexp, url, options) {
    }
}
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(`Object.defineProperty(exports,"__esModule",{
  value: true,
});
const αa_initialize_class_fields = Symbol();
const ScopingHttpClientTest = (() => {
  const ScopingHttpClientTest = (() => {
    const αc_initialize_class_fields = Symbol();
    let ScopingHttpClientTest = class ScopingHttpClientTest extends TestCase {
      async testMatchingUrls(regexp,url,options) {
        
      }
      
      static [αa_initialize_class_fields]() {
        Object.defineProperty(ScopingHttpClientTest,Symbol.reflection,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: 390837,
        });
        Object.defineProperty(ScopingHttpClientTest,Symbol.metadata,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: Symbol(),
        });
        Object.defineProperty(ScopingHttpClientTest.prototype.testMatchingUrls,Symbol.metadata,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: Symbol(),
        });
        {
          let αb = dataProvider('provideMatchingUrls')(ScopingHttpClientTest.prototype.testMatchingUrls,{
            kind: "method",
            name: "testMatchingUrls",
            access: {
              get() {
                return ScopingHttpClientTest.prototype.testMatchingUrls;
              },
            },
            static: false,
            private: false,
            metadataKey: ScopingHttpClientTest.prototype.testMatchingUrls[Symbol.metadata],
            class: {
              name: "ScopingHttpClientTest",
              metadataKey: ScopingHttpClientTest[Symbol.metadata],
            },
          });
          if (αb === undefined) 
            αb = ScopingHttpClientTest.prototype.testMatchingUrls;
          
          ScopingHttpClientTest.prototype.testMatchingUrls = αb;
        }
      }
    };
    ScopingHttpClientTest[αa_initialize_class_fields]();
    
    return ScopingHttpClientTest;
  })();
  return ScopingHttpClientTest;
})();
exports.default = ScopingHttpClientTest;
`);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should correctly compile inline if-else', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
if (!bits(1)) t++;
else t--;
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(`if (! bits(1)) 
  t++;
else t--;
`);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should correctly compile anonymous classes into sequence expressions', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
const x = (_a = class extends this {}, _a.ps = ps.concat(nps.filter(p => !ps.includes(p))), _a);
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(`const αa_initialize_class_fields = Symbol();
const x = (_a = (() => {
  const _anonymous_xΞddcbb = class _anonymous_xΞddcbb extends this {
    
    static [αa_initialize_class_fields]() {
      Object.defineProperty(_anonymous_xΞddcbb,Symbol.reflection,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: 390838,
      });
      Object.defineProperty(_anonymous_xΞddcbb,Symbol.metadata,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: Symbol(),
      });
      
    }
  }
  _anonymous_xΞddcbb[αa_initialize_class_fields]();
  ;
  return _anonymous_xΞddcbb;
})(), _a.ps = ps.concat(nps.filter((p) => ! ps.includes(p))), _a);
`);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should correctly compile anonymous classes into object values', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
const x = ({ [n]: class {
} })[n];
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(`const αa_initialize_class_fields = Symbol();
const x = ({
  [n]: (() => {
    const αb_initialize_class_fields = Symbol();
    let _anonymous_xΞd2774 = class _anonymous_xΞd2774 extends __jymfony.JObject {
      
      static [αa_initialize_class_fields]() {
        Object.defineProperty(_anonymous_xΞd2774,Symbol.reflection,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: 390839,
        });
        Object.defineProperty(_anonymous_xΞd2774,Symbol.metadata,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: Symbol(),
        });
        
      }
    };
    _anonymous_xΞd2774[αa_initialize_class_fields]();
    
    return _anonymous_xΞd2774;
  })(),
})[n];
`);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should correctly compile anonymous classes into object values', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
const Type = Jymfony.Component.Autoloader.Decorator.Type;

export default class FoobarClass {
    /**
     * Constructor.
     */
    constructor(@Type('string') param) {
    }
}
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);

            const module = { exports: {}, };
            runInThisContext(`(function(exports, require, module, __filename, __dirname) {
  'use strict';
${compiled}
})`, {})(module.exports, require, module, 'x.js', __dirname);

            const c = module.exports.default;

            const reflectionData = Compiler.getReflectionData(c);
            expect(reflectionData).not.to.be.undefined;
            expect(reflectionData.methods).to.have.length(1);
            expect(reflectionData.methods[0].name).to.be.equal('constructor');
            expect(reflectionData.methods[0].value[Symbol.metadata]).not.to.be.undefined;
            expect(MetadataStorage.getMetadata(reflectionData.methods[0].value[Symbol.metadata], 0)[0][1]).to.be.equal('string');
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should correctly compile classes reflection data', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
export default class Foobar {
    accessor accessorField;

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should be of type {{ type }}.';
        this.type = undefined;

        return super.__construct(options);
    }

    /**
     * @inheritdoc
     */
    get defaultOption() {
        return 'type';
    }
}
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);

            const module = { exports: {}, };
            runInThisContext(`(function(exports, require, module, __filename, __dirname) {
  'use strict';
${compiled}
})`, {})(module.exports, require, module, 'x.js', __dirname);

            const c = module.exports.default;

            const reflectionData = Compiler.getReflectionData(c);
            expect(reflectionData).not.to.be.undefined;
            expect(reflectionData.fields).to.have.length(3);
            expect(reflectionData.fields.map(f => f.name)).to.be.deep.eq([ 'accessorField', 'message', 'type' ]);
            expect(reflectionData.methods).to.have.length(2);
            expect(reflectionData.methods.map(f => f.name)).to.be.deep.eq([ '__construct', 'defaultOption' ]);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should correctly compile literal objects with unicode chars member names', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
var encodeMap = {'': 'empty','\\xAD':'shy','\\u200C':'zwnj','\\u200D':'zwj','#': 'hash','?': 'qm','foo\\\'bar':'bar'};
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(`var encodeMap = {
  '': 'empty',
  '\\xAD': 'shy',
  '\\u200C': 'zwnj',
  '\\u200D': 'zwj',
  '#': 'hash',
  '?': 'qm',
  'foo\\\'bar': 'bar',
};
`);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });

    it ('should correctly compile catch clause without parameter', () => {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = parser.parse(`
try {
    doThings();
} catch {
    handleException();
}
`);

            const compiler = new Compiler(generator);
            const compiled = compiler.compile(program);
            expect(compiled).to.be.equal(`try {
  doThings();
  
} catch (Ξ_) {
  handleException();
  
}`);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    });
});
