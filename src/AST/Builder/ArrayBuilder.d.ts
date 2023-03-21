import Builder = require('.');

declare class ArrayBuilder<T extends Builder<any>> extends Builder<T> {
    constructor(parent: T);

    empty(): this;

    end(): T;
}

export = ArrayBuilder;
