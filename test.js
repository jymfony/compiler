global.__jymfony = {};
Symbol.__jymfony_field_initialization = Symbol();

const constructor = function (...$args) {
    if (undefined !== this[Symbol.__jymfony_field_initialization]) {
        this[Symbol.__jymfony_field_initialization]();
    }

    const retVal = this.__construct(...$args);
    if (undefined !== retVal && this !== retVal) {
        return retVal;
    }

    return this;
};

__jymfony.JObject = class JObject {
    constructor(...$args) {
        return constructor.bind(this)(...$args);
    }

    __construct() { }
}

function register() {
    return () => {
    };
}
;function initialize() {
    return () => {
    };
}
;const secondary = () => console.log;const logger = {
    logged: (value,{ kind, name }) => {
        if (kind === "method") {
            return function _anonymous_xΞd1319(...args) {
                console.log(`starting ${name} with arguments ${args.join(", ")}`);
                const ret = value.call(this,...args);
                console.log(`ending ${name}`);
                return ret;
            };
        };
        if (kind === "field") {
            return function _anonymous_xΞ4b767(initialValue) {
                console.log(`initializing ${name} with value ${initialValue}`);
                return initialValue;
            };
        };
    },
};const αb_x_private_fieldΞc7d2 = Symbol();
const αd_x_private_fieldΞd85ff = Symbol();
const αf_x_private_fieldΞ30e21 = Symbol();
const αi_x_private_testΞ26dca = Symbol();
const αk_x_private_testΞec165 = Symbol();
const αh_x_temp_testΞ5e90e = Symbol();
const αn_x_private_test_getterΞca62f = Symbol();
const αp_x_private_test_getterΞ97aca = Symbol();
const αm_x_temp_test_getterΞeb1ae = Symbol();
class x extends __jymfony.JObject {
    [αh_x_temp_testΞ5e90e]() {
    }
    [αm_x_temp_test_getterΞeb1ae]() {
        console.log(this);
        return 'test';
    }
    static [αb_x_private_fieldΞc7d2] = function _anonymous_xΞ8954d() {
        let αc = logger.logged(undefined,{
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
        if (αc === undefined)
            αc = (initialValue) => initialValue;
        return αc;
    };
    static [αd_x_private_fieldΞd85ff] = function _anonymous_xΞ7d28f() {
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
    };
    static [αf_x_private_fieldΞ30e21] = function _anonymous_xΞ8ef1c() {
        let αg = initialize((instance,key,value) => {
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
        if (αg === undefined)
            αg = (initialValue) => initialValue;
        return αg;
    };
    static [αi_x_private_testΞ26dca] = (() => {
        let αj = logger.logged(x.prototype[αh_x_temp_testΞ5e90e],{
            kind: "method",
            name: "test",
            access: {
                get() {
                    return x.prototype[αh_x_temp_testΞ5e90e];
                },
            },
            static: false,
            private: false,
        });
        if (αj === undefined)
            αj = x.prototype[αh_x_temp_testΞ5e90e];
        return αj;
    })();
    test = x[αk_x_private_testΞec165];
    static [αk_x_private_testΞec165] = (() => {
        let αl = secondary('great')(x[αi_x_private_testΞ26dca],{
            kind: "method",
            name: "test",
            access: {
                get() {
                    return x[αi_x_private_testΞ26dca];
                },
            },
            static: false,
            private: false,
        });
        if (αl === undefined)
            αl = x[αi_x_private_testΞ26dca];
        return αl;
    })();
    static [αn_x_private_test_getterΞca62f] = (() => {
        let αo = logger.logged(x.prototype[αm_x_temp_test_getterΞeb1ae],{
            kind: "getter",
            name: "test_getter",
            access: {
                get() {
                    return x.prototype[αm_x_temp_test_getterΞeb1ae];
                },
            },
            static: false,
            private: false,
        });
        if (αo === undefined)
            αo = x.prototype[αm_x_temp_test_getterΞeb1ae];
        return αo;
    })();
    get test_getter() {
        debugger;
        return x[αp_x_private_test_getterΞ97aca].call(this);
    }
    static [αp_x_private_test_getterΞ97aca] = (() => {
        let αq = secondary('great')(x[αn_x_private_test_getterΞca62f],{
            kind: "getter",
            name: "test_getter",
            access: {
                get() {
                    return x[αn_x_private_test_getterΞca62f];
                },
            },
            static: false,
            private: false,
        });
        if (αq === undefined)
            αq = x[αn_x_private_test_getterΞca62f];
        return αq;
    })();
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
            value: x[αf_x_private_fieldΞ30e21].call(this,x[αd_x_private_fieldΞd85ff].call(this,x[αb_x_private_fieldΞc7d2].call(this,'foo'))),
        });
    }
}
x[Symbol.docblock] = null;
delete x.prototype[αh_x_temp_testΞ5e90e];
delete x.prototype[αm_x_temp_test_getterΞeb1ae];
;

const c = new x;
console.log(x, c, c.test(), c.field, c.test_getter);
