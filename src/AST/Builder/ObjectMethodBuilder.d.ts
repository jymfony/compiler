import AbstractBuilder = require("./AbstractBuilder");
import FunctionBuilder = require('./FunctionBuilder');

declare class ObjectMethodBuilder<T extends AbstractBuilder<any>> extends FunctionBuilder<T> {
    constructor(parent: T, kind: 'get' | 'set' | 'method');

    end(): T;
}

export = ObjectMethodBuilder;
