require('@jymfony/autoloader');

const ClassLoader = Jymfony.Component.Autoloader.ClassLoader;
ClassLoader.compiler = {
    Compiler: require('./src/Compiler'),
    Parser: require('./src/Parser'),
    AST: require('./src/AST'),
};

require('mocha/bin/_mocha');
