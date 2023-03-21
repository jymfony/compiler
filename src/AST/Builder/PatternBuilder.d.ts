import AbstractBuilder = require('./AbstractBuilder');
import Builder = require('.');
import ObjectPatternBuilder = require('./ObjectPatternBuilder');

declare class PatternBuilder<T extends Builder<any>> extends AbstractBuilder<T> {
    constructor(parent: T);

    object(): ObjectPatternBuilder<typeof this>;

    end(): T;
}

export = PatternBuilder;
