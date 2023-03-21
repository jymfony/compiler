import AbstractBuilder = require('./AbstractBuilder');
import Builder = require(".");

declare class BlockBuilder<T extends AbstractBuilder<any>> extends Builder<T> {
    end(): T;
}

export = BlockBuilder;
