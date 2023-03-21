import Builder = require('.');

declare class UpdateBuilder<T extends Builder<any>> extends Builder<T> {
    private _operator: string;
    private _prefix: boolean;

    constructor(parent: T);

    prefix(prefix?: boolean): this;

    postfix(postfix?: boolean): this;

    operator(op: string): this;

    end(): T;
}

export = UpdateBuilder;
