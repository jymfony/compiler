require('@jymfony/autoloader');
__jymfony.autoload.debug = true;

const seedrandom = require('seedrandom');
seedrandom('compiler init', { global: true });

const ClassLoader = Jymfony.Component.Autoloader.ClassLoader;
ClassLoader.compiler = {
    Compiler: require('./src/Compiler'),
    Parser: require('./src/Parser'),
    AST: require('./src/AST'),
};

const [ ,, ...argv ] = process.argv;
if (0 === argv.length) {
    argv.push('test/**/*Test.js');
}

const Runner = Jymfony.Component.Testing.Framework.Runner;
new Runner().run(argv);
