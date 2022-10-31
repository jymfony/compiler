require('@jymfony/autoloader');
const seedrandom = require('seedrandom');
seedrandom('compiler init', { global: true });

const ClassLoader = Jymfony.Component.Autoloader.ClassLoader;
ClassLoader.compiler = {
    Compiler: require('./src/Compiler'),
    Parser: require('./src/Parser'),
    AST: require('./src/AST'),
};

require('mocha/bin/_mocha');
