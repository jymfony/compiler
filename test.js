function register() {
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
            return function _anonymous_xΞ3b194(...args) {
                console.log(`starting ${name} with arguments ${args.join(", ")}`);
                const ret = value.call(this,...args);
                console.log(`ending ${name}`);
                return ret;
            };
        }
        if (kind === "field") {
            return function _anonymous_xΞ9758b(initialValue) {
                console.log(`initializing ${name} with value ${initialValue}`);
                return initialValue;
            };
        }

    },
};
const αc_x_private_fieldΞ23717 = Symbol();
const αe_x_private_fieldΞ4521e = Symbol();
const αg_x_private_fieldΞ46e1b = Symbol();
const αj_x_private_testΞf2668 = Symbol();
const αl_x_private_testΞb3fed = Symbol();
const αi_x_temp_testΞ62777 = Symbol();
const αo_x_private_test_getterΞ76d20 = Symbol();
const αq_x_private_test_getterΞb7710 = Symbol();
const αn_x_temp_test_getterΞd61e2 = Symbol();
const αt_x_private_test_setterΞda840 = Symbol();
const αv_x_private_test_setterΞ2920c = Symbol();
const αs_x_temp_test_setterΞ290ed = Symbol();
class x extends __jymfony.JObject {
    [αi_x_temp_testΞ62777]() {
        const cc = class _anonymous_xΞ39cac extends __jymfony.JObject {
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
        _anonymous_xΞ39cac = (() => {
            const αx = logger.logged(_anonymous_xΞ39cac,{
                kind: 'field',
                name: "_anonymous_xΞ39cac",
            });
            if (αx === undefined)
                return _anonymous_xΞ39cac;
            return αx;
        })();
    }
    [αn_x_temp_test_getterΞd61e2]() {
        return 'test';
    }
    [αs_x_temp_test_setterΞ290ed](value) {

    }
    static [αc_x_private_fieldΞ23717] = function _anonymous_xΞ23b97() {
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
        ;
        return αd;
    };
    static [αe_x_private_fieldΞ4521e] = function _anonymous_xΞ40896() {
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
        ;
        return αf;
    };
    static [αg_x_private_fieldΞ46e1b] = function _anonymous_xΞa8e2f() {
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
        ;
        return αh;
    };
    static [αj_x_private_testΞf2668] = (() => {
        let αk = logger.logged(x.prototype[αi_x_temp_testΞ62777],{
            kind: "method",
            name: "test",
            access: {
                get() {
                    return x.prototype[αi_x_temp_testΞ62777];
                },
            },
            static: false,
            private: false,
        });
        if (αk === undefined)
            αk = x.prototype[αi_x_temp_testΞ62777];
        ;
        return αk;
    })();
    test = x[αl_x_private_testΞb3fed];
    static [αl_x_private_testΞb3fed] = (() => {
        let αm = secondary('great')(x[αj_x_private_testΞf2668],{
            kind: "method",
            name: "test",
            access: {
                get() {
                    return x[αj_x_private_testΞf2668];
                },
            },
            static: false,
            private: false,
        });
        if (αm === undefined)
            αm = x[αj_x_private_testΞf2668];
        ;
        return αm;
    })();
    static [αo_x_private_test_getterΞ76d20] = (() => {
        let αp = logger.logged(x.prototype[αn_x_temp_test_getterΞd61e2],{
            kind: "getter",
            name: "test_getter",
            access: {
                get() {
                    return x.prototype[αn_x_temp_test_getterΞd61e2];
                },
            },
            static: false,
            private: false,
        });
        if (αp === undefined)
            αp = x.prototype[αn_x_temp_test_getterΞd61e2];
        ;
        return αp;
    })();
    get test_getter() {
        return x[αq_x_private_test_getterΞb7710].call(this);
    }
    static [αq_x_private_test_getterΞb7710] = (() => {
        let αr = secondary('great')(x[αo_x_private_test_getterΞ76d20],{
            kind: "getter",
            name: "test_getter",
            access: {
                get() {
                    return x[αo_x_private_test_getterΞ76d20];
                },
            },
            static: false,
            private: false,
        });
        if (αr === undefined)
            αr = x[αo_x_private_test_getterΞ76d20];
        ;
        return αr;
    })();
    static [αt_x_private_test_setterΞda840] = (() => {
        let αu = logger.logged(x.prototype[αs_x_temp_test_setterΞ290ed],{
            kind: "setter",
            name: "test_setter",
            access: {
                get() {
                    return x.prototype[αs_x_temp_test_setterΞ290ed];
                },
            },
            static: false,
            private: false,
        });
        if (αu === undefined)
            αu = x.prototype[αs_x_temp_test_setterΞ290ed];
        ;
        return αu;
    })();
    set test_setter(value) {
        return x[αv_x_private_test_setterΞ2920c].call(this,value);
    }
    static [αv_x_private_test_setterΞ2920c] = (() => {
        let αw = secondary('great')(x[αt_x_private_test_setterΞda840],{
            kind: "setter",
            name: "test_setter",
            access: {
                get() {
                    return x[αt_x_private_test_setterΞda840];
                },
            },
            static: false,
            private: false,
        });
        if (αw === undefined)
            αw = x[αt_x_private_test_setterΞda840];
        ;
        return αw;
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
            value: x[αg_x_private_fieldΞ46e1b].call(this,x[αe_x_private_fieldΞ4521e].call(this,x[αc_x_private_fieldΞ23717].call(this,'foo'))),
        });
    }
}
x[Symbol.docblock] = null;
delete x.prototype[αs_x_temp_test_setterΞ290ed];
delete x.prototype[αn_x_temp_test_getterΞd61e2];
delete x.prototype[αi_x_temp_testΞ62777];
x = (() => {
    const αa = logger.logged(x,{
        kind: 'field',
        name: "x",
    });
    if (αa === undefined)
        return x;
    return αa;
})();
