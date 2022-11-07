const { dirname, sep } = require('path');
const { readdirSync, readFileSync } = require('fs');
const ClassLoader = Jymfony.Component.Autoloader.ClassLoader;
const Compiler = require('../src/Compiler');
const Generator = require('../src/SourceMap/Generator');
const Parser = require('../src/Parser');
const { expect } = require('chai');
const folder = dirname(require.resolve('test262-parser-tests/package.json'));
const seedrandom = require('seedrandom');

describe('[Compiler] Parser', function () {
    const parser = new Parser();
    const generator = new class extends Generator {
        toString() {
            return '';
        }

        toJSON() {
            return {};
        }
    }();

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
    ];

    const ignored = [
        '7b0a9215ec756496.js', // Multiline comment used as statement terminator
        '946bee37652a31fa.js', // HTML comment after multiline comment
        '9f0d8eb6f7ab8180.js', // HTML comment after multiline comment
    ];

    for (const filename of readdirSync(folder + sep + 'pass')) {
        if (excluded.includes(filename)) {
            continue;
        }

        it ('should pass ' + filename + ' test', ignored.includes(filename) ? undefined : () => {
            const fn = folder + sep + 'pass' + sep + filename;

            const content = readFileSync(fn, { encoding: 'utf-8' });
            const program = parser.parse(content);

            const compiler = new Compiler(new Generator());
            compiler.compile(program);

            expect(program).is.not.null;
        });
    }

    it ('should correctly compile do-while w/o block', () => {
        const program = parser.parse(`
        (function () {
            do
                things()
            while (a > 0);
        })
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);

        expect(program).is.not.null;
        expect(eval(compiled)).is.a('function');
    });

    it ('should correctly parse get/set as identifier', () => {
        const program = parser.parse(`
        (function () {
            obj.get('foo');
            set(obj, 'bar');
        })
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);

        expect(program).is.not.null;
        expect(eval(compiled)).is.a('function');
    });

    it ('should correctly postfix update after space', () => {
        const program = parser.parse(`
        (function () {
            i ++;
        })
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);

        expect(program).is.not.null;
        expect(eval(compiled)).is.a('function');
    });

    it ('should correctly parse init assignment ', () => {
        const program = parser.parse('var u=-1');

        const compiler = new Compiler(generator);
        compiler.compile(program);

        expect(program).is.not.null;
    });

    it ('should correctly parse init assignment ', () => {
        const program = parser.parse('function r(n,t){for(var r=-1,e=null==n?0:n.length;++r<e&&false!==t(n[r],r,n););return n}');

        const compiler = new Compiler(generator);
        compiler.compile(program);

        expect(program).is.not.null;
    });

    it ('should correctly parse import without semicolons', () => {
        const program = parser.parse(`import { Inject } from '@jymfony/decorators'
import { Client } from 'non-existent-package'
`);

        const compiler = new Compiler(generator);
        expect(() => compiler.compile(program)).not.to.throw();
    });

    it ('should correctly compile optional imports', () => {
        const program = parser.parse(`import { Inject } from '@jymfony/decorators';
import { Client } from 'non-existent-package' optional;

export default () => {
    return [ Inject !== undefined, Client === undefined ];
};
`);

        const compiler = new Compiler(generator);
        expect(() => compiler.compile(program)).not.to.throw();
    });

    it ('should correctly compile multiple import flags', () => {
        const program = parser.parse(`import { Inject } from '@jymfony/decorators';
import { Client } from 'non-existent-package' nocompile optional;

export default () => {
    return [ Inject !== undefined, Client === undefined ];
};
`);

        const compiler = new Compiler(generator);
        expect(compiler.compile(program)).to.be.eq(`Object.defineProperty(exports,"__esModule",{
  value: true,
});
const αa = require('@jymfony/decorators');
const Inject = αa.Inject;
const αb = (() => { try { return require.nocompile('non-existent-package'); } catch (e) { return {}; } })();
const Client = αb.Client;
exports.default = () => {
  return [ Inject !== undefined, Client === undefined,  ];
};
`);
    });

    it ('should correctly compile raw imports', () => {
        const program = parser.parse(`import { Sloppy } from 'sloppy-package' nocompile;

export default () => {
    return [ Sloppy === undefined ];
};
`);

        const compiler = new Compiler(generator);
        expect(() => compiler.compile(program)).not.to.throw();
    });

    it ('should parse js code correctly. case #1', () => {
        const program = parser.parse(`
    const res = lines.map((l, i) => {
        return (0 === i && !indentfirst) ? \`\${l}\\n\` : \`\${sp}\${l}\\n\`;
    }).join('');
`);

        const compiler = new Compiler(generator);
        expect(() => compiler.compile(program)).not.to.throw();
    });

    it ('should parse js optional chaining. case #1', () => {
        const program = parser.parse(`
    true === a?.prop1?.[prop2];
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.match(/true === a\?\.prop1\?\.\[prop2\]/);
    });

    it ('should parse js optional chaining. case #2', () => {
        const program = parser.parse(`
    true === a?.prop1?.('test');
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.match(/true === a\?\.prop1\?\.\('test'\)/);
    });

    it ('should parse js null-coalescing opeartor', () => {
        const program = parser.parse(`
    const enabled = obj?.response?.html?.enabled ?? retval.response.html.enabled;
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.eq('const enabled = obj?.response?.html?.enabled ?? retval.response.html.enabled;\n');
    });

    it ('should parse js optional chaining. case #2', () => {
        const program = parser.parse(`
    true === a?.prop1?.('test');
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.match(/true === a\?\.prop1\?\.\('test'\)/);
    });

    it ('should parse consecutive commas in arrays', () => {
        const program = parser.parse(`
    const x = [ 1, , 3, 4 ];
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal('const x = [ 1, , 3, 4,  ];\n');
    });

    it ('should spread operator in object unpacking', () => {
        const program = parser.parse(`
    const { g, ...x } = { g: 'foo', y: 'test', p: 123 };
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal('const { g, ...x } = {\n  g: \'foo\',\n  y: \'test\',\n  p: 123,\n};\n');
    });

    it ('should parse xor operator correctly', () => {
        const program = parser.parse(`
function op_xor(x,y) { return x^y; }
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`function op_xor(x,y) {
  return x ^ y;
}
`);
    });

    it ('should parse async as variable identifier', () => {
        const program = parser.parse(`
var async = require('./lib/async');
async.core = core;
async.isCore = function isCore(x) { return core[x]; };
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`var async = require('./lib/async');
async.core = core;
async.isCore = function isCore(x) {
  return core[x];
};
`);
    });

    it ('should parse break with newline and identifier next', () => {
        const program = parser.parse(`
  for (var i = released.length - 1; i >= 0; i--) {
    if (minimum > getMajor(released[i])) break
    selected.unshift(released[i])
  }
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`for (var i = released.length - 1;i >= 0;i--){
  if (minimum > getMajor(released[i])) 
    break;
  selected.unshift(released[i]);
  
}`);
    });

    it ('should correctly rescan the rest of the file if a wrong regex has been matched', () => {
        const program = parser.parse(`
const foo = cond ? Number(bar) / 100 : undefined; // return a comment
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal('const foo = cond ? Number(bar) / 100 : undefined;\n');
    });

    it ('should parse composed key in literal object', () => {
        const program = parser.parse(`
const a = {[k]: env = defaultEnv};
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`const a = {
  [k]: env = defaultEnv,
};
`);
    });

    it ('should correctly rethrow a rescan through the call chain', () => {
        const program = parser.parse(`
[rgbR, rgbG, rgbB].map(function xmap(v) {
    return v > 4.045 ? Math.pow((v + 5.5) / 105.5, 2.4) * 100 : v / 12.92;
});
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`[ rgbR, rgbG, rgbB,  ].map(function xmap(v) {
  return v > 4.045 ? Math.pow((v + 5.5) / 105.5,2.4) * 100 : v / 12.92;
});
`);
    });

    it ('should correctly rescan multiple times', () => {
        const program = parser.parse(`
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

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`convert.apple.rgb = function rgb(apple) {
  return [ (apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255,  ];
};
convert.rgb.apple = function apple(rgb) {
  return [ (rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535,  ];
};
convert.gray.rgb = function gray(args) {
  return [ args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255,  ];
};
`);
    });

    it ('should correctly split keyword and string operator', () => {
        const program = parser.parse(`
switch(c){case'\\t':read();return;}
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`switch (c) {
  case '\\t':
    read();
    return;
}`);
    });

    it ('should correctly parse yield expression assignment', () => {
        const program = parser.parse(`
result = yield transform(source, options);
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal('result = yield transform(source,options);\n');
    });

    it ('should correctly parse computed class member id', () => {
        const program = parser.parse(`
class x {
  [computed](param) {}
}
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.have.string(`class x extends __jymfony.JObject {
  [computed](param) {
    
  }
`);
    });

    it ('should correctly initialize public instance fields on construct', () => {
        const program = parser.parse(`
class x {
  field = 'foo';
}
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.eq(`const αa_initialize_class_fields = Symbol();
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
      value: 390954,
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
`);
    });

    it ('should correctly invoke decorators on class declarations', () => {
        seedrandom('decorators', { global: true });
        const program = parser.parse(`
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

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.eq(`function register() {
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
              value: 390955,
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
      value: 390956,
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
`);
    });

    it ('should correctly parse bigint notation', () => {
        const program = parser.parse(`
const x = 1n;
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal('const x = 1n;\n');
    });

    it ('should strip shebang directive from generated code', () => {
        const program = parser.parse(`#!/usr/bin/env node

const module = require('module');
console.log(module);
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`const module = require('module');
console.log(module);
`);
    });

    it ('should correctly export named async functions', () => {
        const program = parser.parse(`
export async function named() {
}
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`Object.defineProperty(exports,"__esModule",{
  value: true,
});
async function named() {
  
}
exports.named = named;
`);
    });

    it ('should correctly parse keywords in incorrect context', () => {
        const program = parser.parse(`
const let = 'a let identifier';
const const = 'a const identifier';
const async = 'this is a string';
if (async === null) {
    debugger;
}
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`const let = 'a let identifier';
const const = 'a const identifier';
const async = \'this is a string\';
if (async === null) {
  debugger;
}
`);
    });

    it ('should correctly compile decorators on classes in named exports or variable declarations', () => {
        seedrandom('decorators', { global: true });
        const program = parser.parse(`
        import { Annotation, ANNOTATION_TARGET_CLASS, ANNOTATION_TARGET_FUNCTION } from '../src';
@Annotation(ANNOTATION_TARGET_CLASS)
export class TestAnnotation {
    // ...
}

@Annotation(ANNOTATION_TARGET_CLASS)
export const TestConstClassAnnotation = class {
    // ...
}
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.equal(`Object.defineProperty(exports,"__esModule",{
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
      value: 390957,
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
          value: 390958,
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
`);
    });

    it ('should correctly compile classes with decorated methods on export default', () => {
        seedrandom('decorators', { global: true });
        const program = parser.parse(`import { Get, Route } from '../src';

export default
@Route({ path: '/foobar' })
@Route('/barbar')
class RoutableClass {
    @Get('/get')
    getAction() {}
}
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.eq(`Object.defineProperty(exports,"__esModule",{
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
          value: 390959,
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
`);
    });

    it ('should correctly compile param decorators in private methods', () => {
        const program = parser.parse(`
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

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.eq(`Object.defineProperty(exports,"__esModule",{
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
        value: 390960,
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
`);
    })
});
