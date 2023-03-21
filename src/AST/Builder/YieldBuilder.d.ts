import Builder = require('.');

declare class YieldBuilder<T extends Builder<any>> extends Builder<T> {
    private _delegate: boolean;

    constructor(parent: T);

    delegate(delegate?: boolean): this;
    end(): T;
}

export = YieldBuilder;
