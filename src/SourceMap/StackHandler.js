const { Mapping } = require('../../lib');
const Parser = require('./Parser');
const { Position } = require('../AST');

/**
 * @type {HashTable}
 */
let fileMappings;
let pendingMappings = {};

class StackHandler {
    /**
     * Prepares stack trace using V8 stack trace API.
     *
     * @param {Error} error
     * @param {NodeJS.CallSite[]} stack
     * @param {string | undefined} previous
     */
    static prepareStackTrace(error, stack, previous) {
        let processed = false;
        try {
            const newStack = [];
            for (const frame of stack) {
                const fileName = frame.getFileName();
                if (frame.isNative() || ! fileMappings || ! fileMappings.has(fileName)) {
                    newStack.push(frame);
                    continue;
                }

                const fileMapping = fileMappings.get(fileName);
                const [ mapping, result ] = fileMapping.search(new Mapping(new Position(
                    frame.getLineNumber(),
                    frame.getColumnNumber(),
                )), BTree.COMPARISON_LESSER) || [ null, false ];

                if (!result) {
                    newStack.push(frame);
                    continue;
                }

                const fileLocation = fileName + (false !== mapping.originalLine ? ':' + mapping.originalLine + ':' + mapping.originalColumn : '');

                let functionName = frame.getFunctionName();
                if (functionName && functionName.startsWith('_anonymous_xΞ')) {
                    functionName = null;
                }

                const methodName = frame.getMethodName();
                const typeName = frame.getTypeName();
                const isTopLevel = frame.isToplevel();
                const isConstructor = frame.isConstructor();
                const isMethodCall = !(isTopLevel || isConstructor);

                const generateFunctionCall = () => {
                    let call = '';

                    if (isMethodCall) {
                        if (!!functionName) {
                            if (!!typeName && !functionName.startsWith(typeName)) {
                                call += typeName + '.';
                            }

                            call += functionName;

                            if (!functionName.endsWith(methodName) && !! methodName) {
                                call += ' [as ' + methodName + ']';
                            }
                        } else {
                            if (!!typeName) {
                                call += typeName + '.';
                            }

                            call += methodName || '<anonymous>';
                        }
                    } else if (isConstructor) {
                        call += 'new ' + (functionName || '<anonymous>');
                    } else if (!!functionName) {
                        call += functionName;
                    } else {
                        call += fileLocation;

                        return call;
                    }

                    call += ' (' + fileLocation + ')';

                    return call;
                };

                processed = true;
                newStack.push(
                    (frame.isAsync && frame.isAsync() ? 'async ' : '') +
                    (frame.isPromiseAll && frame.isPromiseAll() ? 'Promise.all (index ' + frame.getPromiseIndex() + ')' : '') +
                    generateFunctionCall()
                );
            }

            if (previous && ! processed) {
                return previous;
            }

            return error.message + '\n\n' +
                '    at ' + newStack.map(String).join('\n    at ');
        } catch (e) {
            if (previous) {
                return previous;
            }

            return 'Internal Error';
        }
    }

    /**
     * Registers a source map.
     *
     * @param {string} filename
     * @param {string} mappings
     */
    static registerSourceMap(filename, mappings) {
        if (undefined === fileMappings) {
            if ('undefined' === typeof HashTable || 'undefined' === typeof BTree) {
                pendingMappings[filename] = mappings;
                return;
            }
            fileMappings = new HashTable();
            for (const [ key, value ] of __jymfony.getEntries(pendingMappings)) {
                fileMappings.put(key, Parser.parseMappings(value));
            }

            pendingMappings = {};

        }

        fileMappings.put(filename, Parser.parseMappings(mappings));
    }
}

module.exports = StackHandler;
const previous = Error.prepareStackTrace;
Error.prepareStackTrace = function (error, stack) {
    return StackHandler.prepareStackTrace(error, stack, previous ? previous(error, stack) : undefined);
};
