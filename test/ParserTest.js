const { dirname, sep } = require('path');
const { readdirSync, readFileSync } = require('fs');
const ClassLoader = Jymfony.Component.Autoloader.ClassLoader;
const Compiler = require('../src/Compiler');
const DescriptorStorage = Jymfony.Component.Autoloader.DescriptorStorage;
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
            parser._descriptorStorage = new DescriptorStorage(new ClassLoader(__jymfony.autoload.finder, require('path'), require('vm')), fn);

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
        expect(compiler.compile(program)).to.be.eq(`const αa = require('@jymfony/decorators');
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
        expect(compiled).to.be.eq(`class x extends __jymfony.JObject {
  static get [Symbol.reflection]() {
    return {
      fields: {
        field: {
          get: (obj) => obj.field,
          set: (obj,value) => obj.field = value,
          docblock: null,
        },
      },
      staticFields: {
      },
    };
  }
  [Symbol.__jymfony_field_initialization]() {
    if (undefined !== super[Symbol.__jymfony_field_initialization]) 
      super[Symbol.__jymfony_field_initialization]();
    Object.defineProperty(this,"field",{
      writable: true,
      enumerable: true,
      configurable: true,
      value: 'foo',
    });
  }
}
x[Symbol.docblock] = null;
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
const αc_x_private_fieldΞe3230 = Symbol();
const αe_x_private_fieldΞ2d2d9 = Symbol();
const αg_x_private_fieldΞa87ad = Symbol();
const αj_x_private_testΞ577e = Symbol();
const αl_x_private_testΞ36fc8 = Symbol();
const αi_x_temp_testΞebcd6 = Symbol();
const αo_x_private_test_getterΞ2d8c2 = Symbol();
const αq_x_private_test_getterΞ9dd90 = Symbol();
const αn_x_temp_test_getterΞ640 = Symbol();
const αt_x_private_test_setterΞb8d2 = Symbol();
const αv_x_private_test_setterΞ7aa42 = Symbol();
const αs_x_temp_test_setterΞde2f4 = Symbol();
const αy_x_private_testMethodΞ32b8e = Symbol();
const αx_x_temp_testMethodΞ897cb = Symbol();
class x extends __jymfony.JObject {
  [αi_x_temp_testΞebcd6]() {
    const cc = (() => {
      let _anonymous_xΞc91f4 = class _anonymous_xΞc91f4 extends __jymfony.JObject {
        static get [Symbol.reflection]() {
          return {
            fields: {
            },
            staticFields: {
            },
          };
        }
      }
      ;
      _anonymous_xΞc91f4[Symbol.docblock] = null;
      _anonymous_xΞc91f4 = (() => {
        const α0 = logger.logged(_anonymous_xΞc91f4,{
          kind: 'class',
          name: "_anonymous_xΞc91f4",
        });
        if (α0 === undefined) 
          return _anonymous_xΞc91f4;
        return α0;
      })();
      
      return _anonymous_xΞc91f4;
    })();
  }
  [αn_x_temp_test_getterΞ640]() {
    return 'test';
  }
  [αs_x_temp_test_setterΞde2f4](value) {
    
  }
  testMethod(firstArg) {
    dump(firstArg);
    
  }
  static [αc_x_private_fieldΞe3230] = function _anonymous_xΞ9502d() {
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
  };
  static [αe_x_private_fieldΞ2d2d9] = function _anonymous_xΞe9a02() {
    let αf = register((target,prop,parameterIndex = null) => {
      
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
  };
  static [αg_x_private_fieldΞa87ad] = function _anonymous_xΞ6e2d3() {
    let αh = initialize((instance,key,value) => {
      
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
    if (αh === undefined) 
      αh = (initialValue) => initialValue;
    
    return αh;
  };
  static [αj_x_private_testΞ577e] = (() => {
    let αk = logger.logged(x.prototype[αi_x_temp_testΞebcd6],{
      kind: "method",
      name: "test",
      access: {
        get() {
          return x.prototype[αi_x_temp_testΞebcd6];
        },
      },
      static: false,
      private: false,
    });
    if (αk === undefined) 
      αk = x.prototype[αi_x_temp_testΞebcd6];
    
    return αk;
  })();
  test = x[αl_x_private_testΞ36fc8];
  static [αl_x_private_testΞ36fc8] = (() => {
    let αm = secondary('great')(x[αj_x_private_testΞ577e],{
      kind: "method",
      name: "test",
      access: {
        get() {
          return x[αj_x_private_testΞ577e];
        },
      },
      static: false,
      private: false,
    });
    if (αm === undefined) 
      αm = x[αj_x_private_testΞ577e];
    
    return αm;
  })();
  static [αo_x_private_test_getterΞ2d8c2] = (() => {
    let αp = logger.logged(x.prototype[αn_x_temp_test_getterΞ640],{
      kind: "getter",
      name: "test_getter",
      access: {
        get() {
          return x.prototype[αn_x_temp_test_getterΞ640];
        },
      },
      static: false,
      private: false,
    });
    if (αp === undefined) 
      αp = x.prototype[αn_x_temp_test_getterΞ640];
    
    return αp;
  })();
  get test_getter() {
    return x[αq_x_private_test_getterΞ9dd90].call(this);
  }
  static [αq_x_private_test_getterΞ9dd90] = (() => {
    let αr = secondary('great')(x[αo_x_private_test_getterΞ2d8c2],{
      kind: "getter",
      name: "test_getter",
      access: {
        get() {
          return x[αo_x_private_test_getterΞ2d8c2];
        },
      },
      static: false,
      private: false,
    });
    if (αr === undefined) 
      αr = x[αo_x_private_test_getterΞ2d8c2];
    
    return αr;
  })();
  static [αt_x_private_test_setterΞb8d2] = (() => {
    let αu = logger.logged(x.prototype[αs_x_temp_test_setterΞde2f4],{
      kind: "setter",
      name: "test_setter",
      access: {
        get() {
          return x.prototype[αs_x_temp_test_setterΞde2f4];
        },
      },
      static: false,
      private: false,
    });
    if (αu === undefined) 
      αu = x.prototype[αs_x_temp_test_setterΞde2f4];
    
    return αu;
  })();
  set test_setter(value) {
    return x[αv_x_private_test_setterΞ7aa42].call(this,value);
  }
  static [αv_x_private_test_setterΞ7aa42] = (() => {
    let αw = secondary('great')(x[αt_x_private_test_setterΞb8d2],{
      kind: "setter",
      name: "test_setter",
      access: {
        get() {
          return x[αt_x_private_test_setterΞb8d2];
        },
      },
      static: false,
      private: false,
    });
    if (αw === undefined) 
      αw = x[αt_x_private_test_setterΞb8d2];
    
    return αw;
  })();
  testMethod = x[αy_x_private_testMethodΞ32b8e];
  static [αy_x_private_testMethodΞ32b8e] = (() => {
    let αz = logger.logged(x.prototype.testMethod,{
      kind: "method",
      name: "testMethod",
      access: {
        get() {
          return x.prototype.testMethod;
        },
      },
      static: false,
      private: false,
    });
    if (αz === undefined) 
      αz = x.prototype.testMethod;
    
    return αz;
  })();
  static get [Symbol.reflection]() {
    if (! this.__jymfony_parameters_reflection) {
      type(Request)(undefined,{
        kind: "parameter",
        target: this,
        name: "testMethod",
        private: false,
        parameterIndex: 0,
      });
      this.__jymfony_parameters_reflection = true;
    }
    return {
      fields: {
        field: {
          get: (obj) => obj.field,
          set: (obj,value) => obj.field = value,
          docblock: null,
        },
      },
      staticFields: {
      },
    };
  }
  [Symbol.__jymfony_field_initialization]() {
    if (undefined !== super[Symbol.__jymfony_field_initialization]) 
      super[Symbol.__jymfony_field_initialization]();
    Object.defineProperty(this,"field",{
      writable: true,
      enumerable: true,
      configurable: true,
      value: x[αg_x_private_fieldΞa87ad].call(this,x[αe_x_private_fieldΞ2d2d9].call(this,x[αc_x_private_fieldΞe3230].call(this,'foo'))),
    });
  }
}
x[Symbol.docblock] = null;
delete x.prototype[αx_x_temp_testMethodΞ897cb];
delete x.prototype[αs_x_temp_test_setterΞde2f4];
delete x.prototype[αn_x_temp_test_getterΞ640];
delete x.prototype[αi_x_temp_testΞebcd6];
x = (() => {
  const αa = logger.logged(x,{
    kind: 'class',
    name: "x",
  });
  if (αa === undefined) 
    return x;
  return αa;
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
        expect(compiled).to.be.equal('async function named() {\n  \n}\nexports.named = named;\n');
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
        expect(compiled).to.be.equal(`const αa = require('../src');
const Annotation = αa.Annotation;
const ANNOTATION_TARGET_CLASS = αa.ANNOTATION_TARGET_CLASS;
const ANNOTATION_TARGET_FUNCTION = αa.ANNOTATION_TARGET_FUNCTION;
class TestAnnotation extends __jymfony.JObject {
  static get [Symbol.reflection]() {
    return {
      fields: {
      },
      staticFields: {
      },
    };
  }
}
TestAnnotation[Symbol.docblock] = null;
TestAnnotation = (() => {
  const αb = Annotation(ANNOTATION_TARGET_CLASS)(TestAnnotation,{
    kind: 'class',
    name: "TestAnnotation",
  });
  if (αb === undefined) 
    return TestAnnotation;
  return αb;
})();
exports.TestAnnotation = TestAnnotation;
const TestConstClassAnnotation = (() => {
  let _anonymous_xΞ96888 = class _anonymous_xΞ96888 extends __jymfony.JObject {
    static get [Symbol.reflection]() {
      return {
        fields: {
        },
        staticFields: {
        },
      };
    }
  }
  ;
  _anonymous_xΞ96888[Symbol.docblock] = null;
  _anonymous_xΞ96888 = (() => {
    const αc = Annotation(ANNOTATION_TARGET_CLASS)(_anonymous_xΞ96888,{
      kind: 'class',
      name: "_anonymous_xΞ96888",
    });
    if (αc === undefined) 
      return _anonymous_xΞ96888;
    return αc;
  })();
  
  return _anonymous_xΞ96888;
})();
exports.TestConstClassAnnotation = TestConstClassAnnotation;
`);
    });

    it ('should correctly compile classes with decorated methods on export default', () => {
        seedrandom('decorators', { global: true });
        const program = parser.parse(`import { Delete, Get, Patch, Post, Put, Route } from '../src';

@Route({ path: '/foobar' })
@Route('/barbar')
export default class RoutableClass {
    @Get('/get')
    getAction() {}
}
`);

        const compiler = new Compiler(generator);
        const compiled = compiler.compile(program);
        expect(compiled).to.be.eq(`const αa = require('../src');
const Delete = αa.Delete;
const Get = αa.Get;
const Patch = αa.Patch;
const Post = αa.Post;
const Put = αa.Put;
const Route = αa.Route;
const RoutableClass = (() => {
  const αe_RoutableClass_private_getActionΞ11ea6 = Symbol();
  const αd_RoutableClass_temp_getActionΞaa291 = Symbol();
  let RoutableClass = class RoutableClass extends __jymfony.JObject {
    getAction() {
      
    }
    getAction = RoutableClass[αe_RoutableClass_private_getActionΞ11ea6];
    static [αe_RoutableClass_private_getActionΞ11ea6] = (() => {
      let αf = Get('/get')(RoutableClass.prototype.getAction,{
        kind: "method",
        name: "getAction",
        access: {
          get() {
            return RoutableClass.prototype.getAction;
          },
        },
        static: false,
        private: false,
      });
      if (αf === undefined) 
        αf = RoutableClass.prototype.getAction;
      
      return αf;
    })();
    static get [Symbol.reflection]() {
      return {
        fields: {
        },
        staticFields: {
        },
      };
    }
  }
  ;
  RoutableClass[Symbol.docblock] = null;
  delete RoutableClass.prototype[αd_RoutableClass_temp_getActionΞaa291];
  RoutableClass = (() => {
    const αb = Route({
      path: '/foobar',
    })(RoutableClass,{
      kind: 'class',
      name: "RoutableClass",
    });
    if (αb === undefined) 
      return RoutableClass;
    return αb;
  })();
  RoutableClass = (() => {
    const αc = Route('/barbar')(RoutableClass,{
      kind: 'class',
      name: "RoutableClass",
    });
    if (αc === undefined) 
      return RoutableClass;
    return αc;
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
        expect(compiled).to.be.eq(`const αa = require("../src");
const Type = αa.Type;
const TypedPrivateMethodClass = (() => {
  let TypedPrivateMethodClass = class TypedPrivateMethodClass extends __jymfony.JObject {
    #getAction(param1,param2,param3) {
      
    }
    static get [Symbol.reflection]() {
      if (! this.__jymfony_parameters_reflection) {
        Type('FooType')(undefined,{
          kind: "parameter",
          target: this,
          name: "#getAction",
          private: true,
          parameterIndex: 0,
        });
        Type(Object)(undefined,{
          kind: "parameter",
          target: this,
          name: "#getAction",
          private: true,
          parameterIndex: 1,
        });
        this.__jymfony_parameters_reflection = true;
      }
      return {
        fields: {
        },
        staticFields: {
        },
      };
    }
  }
  ;
  TypedPrivateMethodClass[Symbol.docblock] = null;
  
  return TypedPrivateMethodClass;
})();
exports.default = TypedPrivateMethodClass;
`);
    })
});
