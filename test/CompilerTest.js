import { runInNewContext, runInThisContext } from 'vm';
import seedrandom from 'seedrandom';

const AST = require('../src/AST');
const Compiler = require('../src/Compiler');
const Generator = require('../src/SourceMap/Generator');
const Parser = require('../src/Parser');
const NullGenerator = Jymfony.Compiler.Tests.NullGenerator;
const StackHandler = require('../src/SourceMap/StackHandler');
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class CompilerTest extends TestCase {
    /**
     * @type {Parser}
     * @private
     */
    _parser;

    /**
     * @type {Compiler}
     * @private
     */
    _compiler;

    get testCaseName() {
        return '[Compiler] ' + super.testCaseName;
    }

    beforeEach() {
        this._parser = new Parser();
        this._compiler = new Compiler(new NullGenerator());
    }

    testShouldCorrectlyCompileDoWhileWithoutBlock() {
        seedrandom('anonymous function', { global: true });
        const program = this._parser.parse(`
        (function () {
            do
                things()
            while (a > 0);
        })
`);

        const compiled = this._compiler.compile(program);

        __self.assertNotNull(program);
        __self.assertEquals(`(function _anonymous_xΞ73d42() {
  do things();
  while (a > 0);
});
`, compiled);
    }

    testShouldCorrectlyCompileMultipleImportFlags() {
        const program = this._parser.parse(`import { Inject } from '@jymfony/decorators';
import { Client } from 'non-existent-package' nocompile optional;

export default () => {
    return [ Inject !== undefined, Client === undefined ];
};
`);

        __self.assertEquals(`Object.defineProperty(exports,"__esModule",{
  value: true,
});
const αa = require('@jymfony/decorators');
const Inject = αa.Inject;
const αb = (() => { try { return require.nocompile('non-existent-package'); } catch (e) { return {}; } })();
const Client = αb.Client;
exports.default = () => {
  return [ Inject !== undefined, Client === undefined ];
};
`, this._compiler.compile(program));
    }

    testShouldCompileSimpleGeneratedExpression() {
        const compiled = this._compiler.compile(new AST.NullLiteral(null));
        __self.assertEquals('null', compiled);
    }

    testShouldCompileSpreadOperatorInObjectUnpacking() {
        const program = this._parser.parse('const { g, ...x } = { g: \'foo\', y: \'test\', p: 123 }');
        __self.assertEquals('const { g, ...x } = {\n  g: \'foo\',\n  y: \'test\',\n  p: 123,\n};\n', this._compiler.compile(program));
    }

    testShouldParseXorOperatorCorrectly() {
        const program = this._parser.parse('function op_xor(x,y) { return x^y; }');

        __self.assertEquals(`function op_xor(x,y) {
  return x ^ y;
}
`, this._compiler.compile(program));
    }

    testShouldCorrectlyParseComputedClassMemberId() {
        const program = this._parser.parse(`
class x {
  [computed](param) {}
}
`);

        __self.assertEquals(`const αa_initialize_class_fields = Symbol();
class x extends __jymfony.JObject {
  [computed](param) {
    
  }
  
  static [αa_initialize_class_fields]() {
    Object.defineProperty(x,Symbol.reflection,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: ${reflectionIdStart++},
    });
    Object.defineProperty(x,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    Object.defineProperty(x.prototype[computed],Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    
  }
}
x[αa_initialize_class_fields]();
`, this._compiler.compile(program));
    }

    testShouldCorrectlyInitializePublicInstanceFieldsOnConstruct() {
        const program = this._parser.parse(`
class x {
  field = 'foo';
}
`);

        __self.assertEquals(`const αa_initialize_class_fields = Symbol();
class x extends __jymfony.JObject {
  [Symbol.__jymfony_field_initialization]() {
    const superClass = Object.getPrototypeOf(x.prototype);
    const superCall = superClass[Symbol.__jymfony_field_initialization];
    if (undefined !== superClass[Symbol.__jymfony_field_initialization]) 
      superCall.apply(this);
    
    this.field = 'foo';
  }
  static [αa_initialize_class_fields]() {
    Object.defineProperty(x,Symbol.reflection,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: ${reflectionIdStart++},
    });
    Object.defineProperty(x,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    Object.defineProperty(x.prototype,Symbol.__jymfony_field_initialization,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: x.prototype[Symbol.__jymfony_field_initialization],
    });
    
  }
}
x[αa_initialize_class_fields]();
`, this._compiler.compile(program));
    }

    testShouldCorrectlyInvokeDecoratorsOnClassDeclarations() {
        seedrandom('decorators', { global: true });
        const program = this._parser.parse(`
function register() { return () => {}; }
function initialize() { return () => {}; }
const secondary = () => console.log;
const logger = {
    logged: (value, { kind, name }) => {
        if (kind === "method") {
            return function (...args) {
                console.log(\`starting \${name} with arguments \${args.join(", ")}\`);
                const ret = value.call(this, ...args);
                console.log(\`ending \${name}\`);
                return ret;
            };
        }

        if (kind === "field") {
            return function (initialValue) {
                console.log(\`initializing \${name} with value \${initialValue}\`);
                return initialValue;
            };
        }
    },
}

@logger.logged
class x {
  @logger.logged
  @register((target, prop, parameterIndex = null) => {})
  @initialize((instance, key, value) => {})
  field = 'foo';

  @logger.logged
  @initialize((instance, key, value) => {})
  accessor fieldAcc = 'foobar';

  @logger.logged
  @secondary('great')
  test() {
    const cc = @logger.logged class {}
  }

  @logger.logged
  @secondary('great')
  get test_getter() {
    return 'test';
  }

  @logger.logged
  @secondary('great')
  set test_setter(value) {
  }

  @logger.logged
  testMethod(@type(Request) firstArg) {
    dump(firstArg);
  }
}
`);

        __self.assertEquals(`function register() {
  return () => {
    
  };
}
function initialize() {
  return () => {
    
  };
}
const secondary = () => console.log;
const logger = {
  logged: (value,{ kind, name }) => {
    if (kind === "method") {
      return function _anonymous_xΞ11ea6(...args) {
        console.log(\`starting \${name} with arguments \${args.join(", ")}\`);
        const ret = value.call(this,...args);
        console.log(\`ending \${name}\`);
        return ret;
      };
    }
    if (kind === "field") {
      return function _anonymous_xΞ8f93b(initialValue) {
        console.log(\`initializing \${name} with value \${initialValue}\`);
        return initialValue;
      };
    }
    
  },
};
const αa_initialize_class_fields = Symbol();
const αb_x_accessor_fieldAccΞe3230 = Symbol(), αb_x_accessor_fieldAccΞe3230_init = [  ];
class x extends __jymfony.JObject {
  
  test() {
    const αn_initialize_class_fields = Symbol();
    const cc = (() => {
      const _anonymous_xΞ5d6ae = (() => {
        const αp_initialize_class_fields = Symbol();
        let _anonymous_xΞ5d6ae = class _anonymous_xΞ5d6ae extends __jymfony.JObject {
          
          static [αn_initialize_class_fields]() {
            Object.defineProperty(_anonymous_xΞ5d6ae,Symbol.reflection,{
              writable: false,
              enumerable: false,
              configurable: true,
              value: ${reflectionIdStart++},
            });
            Object.defineProperty(_anonymous_xΞ5d6ae,Symbol.metadata,{
              writable: false,
              enumerable: false,
              configurable: true,
              value: Symbol(),
            });
            
          }
        };
        _anonymous_xΞ5d6ae[αn_initialize_class_fields]();
        _anonymous_xΞ5d6ae = (() => {
          const αo = logger.logged(_anonymous_xΞ5d6ae,{
            kind: 'class',
            name: "_anonymous_xΞ5d6ae",
            metadataKey: _anonymous_xΞ5d6ae[Symbol.metadata],
          });
          if (αo === undefined) 
            return _anonymous_xΞ5d6ae;
          return αo;
        })();
        
        return _anonymous_xΞ5d6ae;
      })();
      return _anonymous_xΞ5d6ae;
    })();
  }
  get test_getter() {
    return 'test';
  }
  set test_setter(value) {
    
  }
  testMethod(firstArg) {
    dump(firstArg);
    
  }
  get fieldAcc() {
    return this[αb_x_accessor_fieldAccΞe3230];
  }
  set fieldAcc(value) {
    this[αb_x_accessor_fieldAccΞe3230] = value;
  }
  [Symbol.__jymfony_field_initialization]() {
    const superClass = Object.getPrototypeOf(x.prototype);
    const superCall = superClass[Symbol.__jymfony_field_initialization];
    if (undefined !== superClass[Symbol.__jymfony_field_initialization]) 
      superCall.apply(this);
    
    this.field = (() => {
      let αf = initialize((instance,key,value) => {
        
      })(undefined,{
        kind: 'field',
        name: "field",
        access: {
          get() {
            return this.field;
          },
          set(value) {
            this.field = value;
            
          },
        },
        static: false,
        private: false,
      });
      if (αf === undefined) 
        αf = (initialValue) => initialValue;
      
      return αf;
    }).call(this,(() => {
      let αe = register((target,prop,parameterIndex = null) => {
        
      })(undefined,{
        kind: 'field',
        name: "field",
        access: {
          get() {
            return this.field;
          },
          set(value) {
            this.field = value;
            
          },
        },
        static: false,
        private: false,
      });
      if (αe === undefined) 
        αe = (initialValue) => initialValue;
      
      return αe;
    }).call(this,(() => {
      let αd = logger.logged(undefined,{
        kind: 'field',
        name: "field",
        access: {
          get() {
            return this.field;
          },
          set(value) {
            this.field = value;
            
          },
        },
        static: false,
        private: false,
      });
      if (αd === undefined) 
        αd = (initialValue) => initialValue;
      
      return αd;
    }).call(this,'foo')));
    this[αb_x_accessor_fieldAccΞe3230] = (() => {
      let initialValue = 'foobar';
      for (const initFn of αb_x_accessor_fieldAccΞe3230_init){
        const v = initFn(initialValue);
        if (v !== undefined) 
          initialValue = v;
        
        
      }
      return initialValue;
    })();
  }
  static [αa_initialize_class_fields]() {
    Object.defineProperty(x,Symbol.reflection,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: ${reflectionIdStart++},
    });
    Object.defineProperty(x,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    Object.defineProperty(x.prototype.test,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    Object.defineProperty(Object.getOwnPropertyDescriptor(x.prototype,"test_getter").get,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    Object.defineProperty(Object.getOwnPropertyDescriptor(x.prototype,"test_setter").set,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    Object.defineProperty(x.prototype.testMethod,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    type(Request)(undefined,{
      kind: "parameter",
      name: "firstArg",
      parameterIndex: 0,
      metadataKey: x.prototype.testMethod[Symbol.metadata],
      class: {
        name: "x",
        metadataKey: x[Symbol.metadata],
      },
    });
    Object.defineProperty(Object.getOwnPropertyDescriptor(x.prototype,"fieldAcc").get,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    Object.defineProperty(Object.getOwnPropertyDescriptor(x.prototype,"fieldAcc").set,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    {
      const { get: oldGet, set: oldSet } = Object.getOwnPropertyDescriptor(x.prototype,"fieldAcc");
      let { get: newGet = oldGet, set: newSet = oldSet, init } = (() => {
        const s = logger.logged({
          get: oldGet,
          set: oldSet,
        },{
          kind: 'accessor',
          name: "fieldAcc",
          static: false,
          private: false,
          metadataKey: Object.getOwnPropertyDescriptor(x.prototype,"fieldAcc").get[Symbol.metadata],
          class: {
            name: "x",
            metadataKey: x[Symbol.metadata],
          },
        });
        if (s === undefined) 
          return {
        };
        return s;
      })();
      Object.defineProperty(x.prototype,"fieldAcc",{
        get: newGet,
        set: newSet,
      });
      if (init !== undefined) 
        αb_x_accessor_fieldAccΞe3230_init.push(init);
      
      
    }{
      const { get: oldGet, set: oldSet } = Object.getOwnPropertyDescriptor(x.prototype,"fieldAcc");
      let { get: newGet = oldGet, set: newSet = oldSet, init } = (() => {
        const s = initialize((instance,key,value) => {
          
        })({
          get: oldGet,
          set: oldSet,
        },{
          kind: 'accessor',
          name: "fieldAcc",
          static: false,
          private: false,
          metadataKey: Object.getOwnPropertyDescriptor(x.prototype,"fieldAcc").get[Symbol.metadata],
          class: {
            name: "x",
            metadataKey: x[Symbol.metadata],
          },
        });
        if (s === undefined) 
          return {
        };
        return s;
      })();
      Object.defineProperty(x.prototype,"fieldAcc",{
        get: newGet,
        set: newSet,
      });
      if (init !== undefined) 
        αb_x_accessor_fieldAccΞe3230_init.push(init);
      
      
    }{
      let αg = logger.logged(x.prototype.test,{
        kind: "method",
        name: "test",
        access: {
          get() {
            return x.prototype.test;
          },
        },
        static: false,
        private: false,
        metadataKey: x.prototype.test[Symbol.metadata],
        class: {
          name: "x",
          metadataKey: x[Symbol.metadata],
        },
      });
      if (αg === undefined) 
        αg = x.prototype.test;
      
      x.prototype.test = αg;
    }{
      let αh = secondary('great')(x.prototype.test,{
        kind: "method",
        name: "test",
        access: {
          get() {
            return x.prototype.test;
          },
        },
        static: false,
        private: false,
        metadataKey: x.prototype.test[Symbol.metadata],
        class: {
          name: "x",
          metadataKey: x[Symbol.metadata],
        },
      });
      if (αh === undefined) 
        αh = x.prototype.test;
      
      x.prototype.test = αh;
    }{
      const descriptor = Object.getOwnPropertyDescriptor(x.prototype,"test_getter");
      let { get } = descriptor;
      let αi = logger.logged(get,{
        kind: "getter",
        name: "test_getter",
        access: {
          get() {
            return get;
          },
        },
        static: false,
        private: false,
        metadataKey: get[Symbol.metadata],
        class: {
          name: "x",
          metadataKey: x[Symbol.metadata],
        },
      });
      if (αi === undefined) 
        αi = get;
      
      descriptor.get = αi;
      Object.defineProperty(x.prototype,"test_getter",descriptor);
    }{
      const descriptor = Object.getOwnPropertyDescriptor(x.prototype,"test_getter");
      let { get } = descriptor;
      let αj = secondary('great')(get,{
        kind: "getter",
        name: "test_getter",
        access: {
          get() {
            return get;
          },
        },
        static: false,
        private: false,
        metadataKey: get[Symbol.metadata],
        class: {
          name: "x",
          metadataKey: x[Symbol.metadata],
        },
      });
      if (αj === undefined) 
        αj = get;
      
      descriptor.get = αj;
      Object.defineProperty(x.prototype,"test_getter",descriptor);
    }{
      const descriptor = Object.getOwnPropertyDescriptor(x.prototype,"test_setter");
      let { set } = descriptor;
      let αk = logger.logged(set,{
        kind: "setter",
        name: "test_setter",
        access: {
          get() {
            return set;
          },
        },
        static: false,
        private: false,
        metadataKey: set[Symbol.metadata],
        class: {
          name: "x",
          metadataKey: x[Symbol.metadata],
        },
      });
      if (αk === undefined) 
        αk = set;
      
      descriptor.set = αk;
      Object.defineProperty(x.prototype,"test_setter",descriptor);
    }{
      const descriptor = Object.getOwnPropertyDescriptor(x.prototype,"test_setter");
      let { set } = descriptor;
      let αl = secondary('great')(set,{
        kind: "setter",
        name: "test_setter",
        access: {
          get() {
            return set;
          },
        },
        static: false,
        private: false,
        metadataKey: set[Symbol.metadata],
        class: {
          name: "x",
          metadataKey: x[Symbol.metadata],
        },
      });
      if (αl === undefined) 
        αl = set;
      
      descriptor.set = αl;
      Object.defineProperty(x.prototype,"test_setter",descriptor);
    }{
      let αm = logger.logged(x.prototype.testMethod,{
        kind: "method",
        name: "testMethod",
        access: {
          get() {
            return x.prototype.testMethod;
          },
        },
        static: false,
        private: false,
        metadataKey: x.prototype.testMethod[Symbol.metadata],
        class: {
          name: "x",
          metadataKey: x[Symbol.metadata],
        },
      });
      if (αm === undefined) 
        αm = x.prototype.testMethod;
      
      x.prototype.testMethod = αm;
    }Object.defineProperty(x.prototype,Symbol.__jymfony_field_initialization,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: x.prototype[Symbol.__jymfony_field_initialization],
    });
    
  }
}
x[αa_initialize_class_fields]();
x = (() => {
  const αc = logger.logged(x,{
    kind: 'class',
    name: "x",
    metadataKey: x[Symbol.metadata],
  });
  if (αc === undefined) 
    return x;
  return αc;
})();
`, this._compiler.compile(program));
    }

    testShouldCompileAssertExpressionsIfDebugIsEnabled() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = true;

        try {
            const program = this._parser.parse('__assert(foo instanceof Foo);');
            const compiled = this._compiler.compile(program);
            __self.assertEquals('__assert(foo instanceof Foo);\n', compiled);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldNotCompileAssertExpressionsIfDebugIsDisabled() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse('__assert(foo instanceof Foo);');
            const compiled = this._compiler.compile(program);
            __self.assertEquals('', compiled);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyCompileClassesWithPrivateMembers() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
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

            __self.assertEquals(`Object.defineProperty(exports,"__esModule",{
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
      value: ${reflectionIdStart++},
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
        value: ${reflectionIdStart++},
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
`, this._compiler.compile(program));
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldHandleErrorStackCorrectly() {
        if (__jymfony.version_compare(process.versions.node, '12', '<')) {
            __self.markTestSkipped();
        }

        const program = this._parser.parse(`
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
            __self.fail();
        } catch (e) {
            __self.assertStringContainsString(`x.js:6
      throw new Error('Has to be thrown');
      ^

Has to be thrown

    at new x (x.js:5:18)
    at x.js:11:0`, e.stack);
        }
    }

    testShouldReadAndAdaptMultipleSourceMap() {
        if (__jymfony.version_compare(process.versions.node, '12', '<')) {
            __self.markTestSkipped();
        }

        const program = this._parser.parse(`
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
        const recompiled = compiler2.compile(this._parser.parse(compiled));
        StackHandler.registerSourceMap('x.ts', genStep2.toJSON().mappings);

        try {
            runInNewContext(recompiled, { Symbol }, { filename: 'x.ts' });
            __self.fail();
        } catch (e) {
            __self.assertStringContainsString(`x.ts:3
    throw new Error('Has to be thrown');
    ^

Has to be thrown

    at new x (x.ts:4:14)
    at x.ts:9:0`, e.stack);
        }
    }

    testShouldCompileExportsCorrectly() {
        const program = this._parser.parse(`
export { x, y, z as ɵZ };
`);

        __self.assertEquals(
`Object.defineProperty(exports,"__esModule",{
  value: true,
});
exports.x = x;
exports.y = y;
exports.ɵZ = z;
`, this._compiler.compile(program));
    }

    testShouldCorrectlyCompileIfElsesWithoutBraces() {
        const program = this._parser.parse(`
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

        __self.assertEquals(`function x(er,real) {
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
`, this._compiler.compile(program));
    }

    testShouldCorrectlyCompileNewExpressionsWithAnonymousClasses() {
        seedrandom('anonymous classes', { global: true });
        const program = this._parser.parse(`
const x = new class {
    getFoo() { }
}();
`);

        __self.assertEquals(`const x = new ((() => {
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
          value: ${reflectionIdStart+=2},
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
`, this._compiler.compile(program));
    }

    testShouldCorrectlyCompileClassesWithAutoAccessors() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
export default class Foo {
    accessor internal;
}
`);

            __self.assertEquals(`Object.defineProperty(exports,"__esModule",{
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
        value: ${++reflectionIdStart},
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
`, this._compiler.compile(program));
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyCompileAnonymousClassesInParenthesizedExpression() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
const x = new (class extends GenericRetryStrategy {
    methodX() {
    }
})(0);

module.exports = x;
`);

            __self.assertEquals(`const x = new ((() => {
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
          value: ${++reflectionIdStart},
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
`, this._compiler.compile(program));
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyCompileAnonymousClassesInVariableDeclarators() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
export default class ScopingHttpClientTest extends TestCase {
    @dataProvider('provideMatchingUrls')
    async testMatchingUrls(regexp, url, options) {
    }
}
`);

            __self.assertEquals(`Object.defineProperty(exports,"__esModule",{
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
          value: ${++reflectionIdStart},
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
`, this._compiler.compile(program));
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyCompileInlineIfElse() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
if (!bits(1)) t++;
else t--;
`);

            __self.assertEquals(`if (! bits(1)) 
  t++;
else t--;
`, this._compiler.compile(program));
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyCompileAnonymousClassesIntoSequenceExpressions() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
const x = (_a = class extends this {}, _a.ps = ps.concat(nps.filter(p => !ps.includes(p))), _a);
`);

            __self.assertEquals(`const αa_initialize_class_fields = Symbol();
const x = (_a = (() => {
  const _anonymous_xΞddcbb = class _anonymous_xΞddcbb extends this {
    
    static [αa_initialize_class_fields]() {
      Object.defineProperty(_anonymous_xΞddcbb,Symbol.reflection,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: ${++reflectionIdStart},
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
`, this._compiler.compile(program));
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyCompileAnonymousClassesIntoObjectValues() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
const x = ({ [n]: class {
} })[n];
`);

            __self.assertEquals(`const αa_initialize_class_fields = Symbol();
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
`, this._compiler.compile(program));
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyCompileAnonymousClassesIntoObjectValues() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
const Type = Jymfony.Component.Autoloader.Decorator.Type;

export default class FoobarClass {
    /**
     * Constructor.
     */
    constructor(@Type('string') param) {
    }
}
`);

            const compiled = this._compiler.compile(program);
            const module = { exports: {}, };
            runInThisContext(`(function(exports, require, module, __filename, __dirname) {
  'use strict';
${compiled}
})`, {})(module.exports, require, module, 'x.js', __dirname);

            const c = module.exports.default;

            const reflectionData = Compiler.getReflectionData(c);
            __self.assertNotNull(reflectionData);
            __self.assertCount(1, reflectionData.methods);
            __self.assertEquals('constructor', reflectionData.methods[0].name);
            __self.assertNotNull(reflectionData.methods[0].value[Symbol.metadata]);
            __self.assertEquals('string', MetadataStorage.getMetadata(reflectionData.methods[0].value[Symbol.metadata], 0)[0][1]);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyCompileClassesReflectionData() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
/**
 * Used to verify class docblock.
 */
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

            const compiled = this._compiler.compile(program);
            const module = { exports: {}, };
            runInThisContext(`(function(exports, require, module, __filename, __dirname) {
  'use strict';
${compiled}
})`, {})(module.exports, require, module, 'x.js', __dirname);

            const c = module.exports.default;

            const reflectionData = Compiler.getReflectionData(c);
            __self.assertNotNull(reflectionData);
            __self.assertCount(3, reflectionData.fields);
            __self.assertEquals([ 'accessorField', 'message', 'type' ], reflectionData.fields.map(f => f.name));
            __self.assertCount(2, reflectionData.methods);
            __self.assertEquals([ '__construct', 'defaultOption' ], reflectionData.methods.map(f => f.name));
            __self.assertEquals('/**\n     * @inheritdoc\n     */', reflectionData.methods.find(f => f.name === '__construct').docblock);
            __self.assertEquals('/**\n * Used to verify class docblock.\n */', reflectionData.docblock);
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyCompileLiteralObjectsWithUnicodeCharsMemberNames() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
var encodeMap = {'': 'empty','\\xAD':'shy','\\u200C':'zwnj','\\u200D':'zwj','#': 'hash','?': 'qm','foo\\\'bar':'bar'};
`);

            __self.assertEquals(`var encodeMap = {
  '': 'empty',
  '\\xAD': 'shy',
  '\\u200C': 'zwnj',
  '\\u200D': 'zwj',
  '#': 'hash',
  '?': 'qm',
  'foo\\\'bar': 'bar',
};
`, this._compiler.compile(program));
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyCompileCatchClauseWithoutParameter() {
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const program = this._parser.parse(`
try {
    doThings();
} catch {
    handleException();
}
`);

            __self.assertEquals(`try {
  doThings();
  
} catch (Ξ_) {
  handleException();
  
}`, this._compiler.compile(program));
        } finally {
            __jymfony.autoload.debug = debug;
        }
    }

    testShouldCorrectlyExportNamedAsyncFunctions() {
        const program = this._parser.parse(`
export async function named() {
}
`);

        __self.assertEquals(`Object.defineProperty(exports,"__esModule",{
  value: true,
});
async function named() {
  
}
exports.named = named;
`, this._compiler.compile(program));
    }

    testShouldCorrectlyCompileDecoratorsOnClassesInNamedExportsOrVariableDeclarations() {
        seedrandom('decorators', { global: true });
        const program = this._parser.parse(`
        import { Annotation, ANNOTATION_TARGET_CLASS, ANNOTATION_TARGET_FUNCTION } from '../src';
export
@Annotation(ANNOTATION_TARGET_CLASS)
class TestAnnotation {
    // ...
}

export const TestConstClassAnnotation = @Annotation(ANNOTATION_TARGET_CLASS) class {
    // ...
}
`);

        __self.assertEquals(`Object.defineProperty(exports,"__esModule",{
  value: true,
});
const αa = require('../src');
const Annotation = αa.Annotation;
const ANNOTATION_TARGET_CLASS = αa.ANNOTATION_TARGET_CLASS;
const ANNOTATION_TARGET_FUNCTION = αa.ANNOTATION_TARGET_FUNCTION;
const αb_initialize_class_fields = Symbol();
class TestAnnotation extends __jymfony.JObject {
  
  static [αb_initialize_class_fields]() {
    Object.defineProperty(TestAnnotation,Symbol.reflection,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: ${reflectionIdStart+=19},
    });
    Object.defineProperty(TestAnnotation,Symbol.metadata,{
      writable: false,
      enumerable: false,
      configurable: true,
      value: Symbol(),
    });
    
  }
}
TestAnnotation[αb_initialize_class_fields]();
TestAnnotation = (() => {
  const αc = Annotation(ANNOTATION_TARGET_CLASS)(TestAnnotation,{
    kind: 'class',
    name: "TestAnnotation",
    metadataKey: TestAnnotation[Symbol.metadata],
  });
  if (αc === undefined) 
    return TestAnnotation;
  return αc;
})();
exports.TestAnnotation = TestAnnotation;
const αd_initialize_class_fields = Symbol();
const TestConstClassAnnotation = (() => {
  const _anonymous_xΞ96888 = (() => {
    const αf_initialize_class_fields = Symbol();
    let _anonymous_xΞ96888 = class _anonymous_xΞ96888 extends __jymfony.JObject {
      
      static [αd_initialize_class_fields]() {
        Object.defineProperty(_anonymous_xΞ96888,Symbol.reflection,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: ${++reflectionIdStart},
        });
        Object.defineProperty(_anonymous_xΞ96888,Symbol.metadata,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: Symbol(),
        });
        
      }
    };
    _anonymous_xΞ96888[αd_initialize_class_fields]();
    _anonymous_xΞ96888 = (() => {
      const αe = Annotation(ANNOTATION_TARGET_CLASS)(_anonymous_xΞ96888,{
        kind: 'class',
        name: "_anonymous_xΞ96888",
        metadataKey: _anonymous_xΞ96888[Symbol.metadata],
      });
      if (αe === undefined) 
        return _anonymous_xΞ96888;
      return αe;
    })();
    
    return _anonymous_xΞ96888;
  })();
  return _anonymous_xΞ96888;
})();
exports.TestConstClassAnnotation = TestConstClassAnnotation;
`, this._compiler.compile(program));
    }

    testShouldCorrectlyCompileClassesWithDecoratedMethodsOnExportDefault() {
        seedrandom('decorators', { global: true });
        const program = this._parser.parse(`import { Get, Route } from '../src';

export default
@Route({ path: '/foobar' })
@Route('/barbar')
class RoutableClass {
    @Get('/get')
    getAction() {}
}
`);

        __self.assertEquals(`Object.defineProperty(exports,"__esModule",{
  value: true,
});
const αa = require('../src');
const Get = αa.Get;
const Route = αa.Route;
const αb_initialize_class_fields = Symbol();
const RoutableClass = (() => {
  const RoutableClass = (() => {
    const αf_initialize_class_fields = Symbol();
    let RoutableClass = class RoutableClass extends __jymfony.JObject {
      getAction() {
        
      }
      
      static [αb_initialize_class_fields]() {
        Object.defineProperty(RoutableClass,Symbol.reflection,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: ${++reflectionIdStart},
        });
        Object.defineProperty(RoutableClass,Symbol.metadata,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: Symbol(),
        });
        Object.defineProperty(RoutableClass.prototype.getAction,Symbol.metadata,{
          writable: false,
          enumerable: false,
          configurable: true,
          value: Symbol(),
        });
        {
          let αe = Get('/get')(RoutableClass.prototype.getAction,{
            kind: "method",
            name: "getAction",
            access: {
              get() {
                return RoutableClass.prototype.getAction;
              },
            },
            static: false,
            private: false,
            metadataKey: RoutableClass.prototype.getAction[Symbol.metadata],
            class: {
              name: "RoutableClass",
              metadataKey: RoutableClass[Symbol.metadata],
            },
          });
          if (αe === undefined) 
            αe = RoutableClass.prototype.getAction;
          
          RoutableClass.prototype.getAction = αe;
        }
      }
    };
    RoutableClass[αb_initialize_class_fields]();
    RoutableClass = (() => {
      const αc = Route({
        path: '/foobar',
      })(RoutableClass,{
        kind: 'class',
        name: "RoutableClass",
        metadataKey: RoutableClass[Symbol.metadata],
      });
      if (αc === undefined) 
        return RoutableClass;
      return αc;
    })();
    RoutableClass = (() => {
      const αd = Route('/barbar')(RoutableClass,{
        kind: 'class',
        name: "RoutableClass",
        metadataKey: RoutableClass[Symbol.metadata],
      });
      if (αd === undefined) 
        return RoutableClass;
      return αd;
    })();
    
    return RoutableClass;
  })();
  return RoutableClass;
})();
exports.default = RoutableClass;
`, this._compiler.compile(program));
    }

    testShouldCorrectlyCompileParamDecoratorsInPrivateMethods() {
        const program = this._parser.parse(`
import { Type } from "../src";

export default class TypedPrivateMethodClass {
    #getAction(
        @Type('FooType') param1,
        @Type(Object) param2,
        param3
    ) {
    }
}
`);

        __self.assertEquals(`Object.defineProperty(exports,"__esModule",{
  value: true,
});
const αa = require("../src");
const Type = αa.Type;
const αb_initialize_class_fields = Symbol();
const TypedPrivateMethodClass = (() => {
  const TypedPrivateMethodClass = class TypedPrivateMethodClass extends __jymfony.JObject {
    #getAction(param1,param2,param3) {
      
    }
    static get [Symbol.jymfony_private_accessors]() {
      return {
        fields: {
        },
        staticFields: {
        },
        methods: {
          getAction: {
            call: (obj,...args) => obj.#getAction(...args),
            metadataKey: () => {
              const αc = Object.getOwnPropertyDescriptor(TypedPrivateMethodClass.prototype.#getAction,Symbol.metadata);
              if (undefined === αc) 
                Object.defineProperty(TypedPrivateMethodClass.prototype.#getAction,Symbol.metadata,{
                writable: false,
                enumerable: false,
                configurable: true,
                value: Symbol(),
              });
              
              return TypedPrivateMethodClass.prototype.#getAction[Symbol.metadata];
            },
          },
        },
        staticMethods: {
        },
      };
    }
    
    static [αb_initialize_class_fields]() {
      Object.defineProperty(TypedPrivateMethodClass,Symbol.reflection,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: ${++reflectionIdStart},
      });
      Object.defineProperty(TypedPrivateMethodClass,Symbol.metadata,{
        writable: false,
        enumerable: false,
        configurable: true,
        value: Symbol(),
      });
      Type('FooType')(undefined,{
        kind: "parameter",
        name: "param1",
        parameterIndex: 0,
        metadataKey: TypedPrivateMethodClass[Symbol.jymfony_private_accessors].methods.getAction.metadataKey(),
        class: {
          name: "TypedPrivateMethodClass",
          metadataKey: TypedPrivateMethodClass[Symbol.metadata],
        },
      });
      Type(Object)(undefined,{
        kind: "parameter",
        name: "param2",
        parameterIndex: 1,
        metadataKey: TypedPrivateMethodClass[Symbol.jymfony_private_accessors].methods.getAction.metadataKey(),
        class: {
          name: "TypedPrivateMethodClass",
          metadataKey: TypedPrivateMethodClass[Symbol.metadata],
        },
      });
      
    }
  }
  TypedPrivateMethodClass[αb_initialize_class_fields]();
  ;
  return TypedPrivateMethodClass;
})();
exports.default = TypedPrivateMethodClass;
`, this._compiler.compile(program));
    }
}
