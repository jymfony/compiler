const req = module => new __jymfony.ManagedProxy(global.Function, proxy => {
    proxy.target = require(module);
    proxy.initializer = undefined;
});

module.exports = {
    Iife: req('./Iife'),
    Member: req('./Member'),
    New: req('./New'),
    Null: req('./Null'),
    Undefined: req('./Undefined'),
    Variable: req('./Variable'),
};
