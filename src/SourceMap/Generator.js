const { Mapping, base64vlq_encode } = require('../../lib');
const MappingList = require('./MappingList');
const Parser = require('./Parser');
const { Position } = require('../AST');

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally.
 */
class Generator {
    /**
     * Constructor.
     *
     * @param {null|string} [file] The filename of the source.
     * @param {boolean} [skipValidation = false]
     */
    constructor({ file = null, skipValidation = false } = {}) {
        /**
         * @type {string}
         *
         * @private
         */
        this._file = file;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._sources = [ file ];

        /**
         * @type {boolean}
         *
         * @private
         */
        this._skipValidation = skipValidation;

        /**
         * @type {MappingList}
         *
         * @private
         */
        this._mappings = new MappingList();

        /**
         * @type {string[]}
         *
         * @private
         */
        this._sourcesContent = [ null ];
    }

    /**
     * Add a single mapping from original source line and column to the generated
     * source's line and column for this source map being created.
     *
     * @param {Position} generated Generated line and column positions.
     * @param {null|Position} [original] Original line and column positions.
     */
    addMapping({ generated, original = null }) {
        if (! this._skipValidation) {
            Generator._validateMapping(generated, original);
        }

        if (null === original) {
            // This._mappings.add(new Mapping(generated));
        } else {
            this._mappings.add(new Mapping(generated, original, this._file));
        }
    }

    applyMapping(original, sources, sourcesContent) {
        const originalMappings = Parser.parseMappings(original);
        const newSources = [];

        // Find mappings for the "sourceFile"
        this._mappings.map(mapping => {
            if (null === mapping.originalLine) {
                return false;
            }

            // Check if it can be mapped by the source map, then update the mapping.
            const [ original, result ] = originalMappings.search(new Mapping(new Position(
                mapping.originalLine,
                mapping.originalColumn,
            ))) || [ null, false ];

            if (! result) {
                return false;
            }

            // Copy mapping
            mapping.source = isNumber(original.source) ? sources[original.source] : original.source;
            mapping.originalLine = original.originalLine;
            mapping.originalColumn = original.originalColumn;

            if (null != original.name) {
                mapping.name = original.name;
            }

            const source = mapping.source;
            if (!! source && ! newSources.includes(source)) {
                newSources.push(source);
            }

            return true;
        });

        this._sources = newSources;
        this._sourcesContent = [];

        for (const source of this._sources) {
            const idx = sources.indexOf(source);
            if (-1 === idx) {
                this._sourcesContent.push(null);
                continue;
            }

            this._sourcesContent.push(sourcesContent[idx]);
        }
    }

    /**
     * Set the source content for a source file.
     */
    set sourceContent(content) {
        this._sourcesContent[0] = content;
    }

    /**
     * Externalize the source map.
     */
    toJSON() {
        const map = {
            version: 3,
            sources: this._sources,
            mappings: this._serializeMappings(),
        };

        if (null != this._file) {
            map.file = this._file;
        }

        if (this._sourcesContent.length) {
            map.sourcesContent = this._sourcesContent;
        }

        return map;
    }

    /**
     * Render the source map being generated to a string.
     */
    toString() {
        return JSON.stringify(this.toJSON());
    }

    /**
     * A mapping can have one of the three levels of data:
     *
     *   1. Just the generated position.
     *   2. The Generated position, original position, and original source.
     *   3. Generated and original position, original source, as well as a name
     *      token.
     *
     * To maintain consistency, we validate that any new mapping being added falls
     * in to one of these categories.
     *
     * @param {Position} generated
     * @param {Position} original
     */
    static _validateMapping(generated, original) {
        if (original && (! isNumber(original.line) || ! isNumber(original.column))) {
            throw new Error(
                'original.line and original.column are not numbers -- you probably meant to omit ' +
                'the original mapping entirely and only map the generated position. If so, pass ' +
                'null for the original mapping instead of an object with empty or null values.'
            );
        }

        if (generated && 'line' in generated && 'column' in generated
            && 0 < generated.line && 0 <= generated.column && ! original) {
            // Case 1.
        } else if (generated && 'line' in generated && 'column' in generated
            && original && 'line' in original && 'column' in original
            && 0 < generated.line && 0 <= generated.column
            && 0 < original.line && 0 <= original.column) {
            // Cases 2 and 3.
        } else {
            throw new Error('Invalid mapping: ' + JSON.stringify({ generated, original }));
        }
    }

    /**
     * Serialize the accumulated mappings in to the stream of base 64 VLQs
     * specified by the source map format.
     */
    _serializeMappings() {
        let previousGeneratedColumn = 0;
        let previousGeneratedLine = 1;
        let previousOriginalColumn = 0;
        let previousOriginalLine = 0;
        let previousSource = 0;
        let result = '';
        let next;
        let mapping;
        let sourceIdx;

        const mappings = this._mappings.toArray();
        for (let i = 0, len = mappings.length; i < len; i++) {
            mapping = mappings[i];
            next = '';

            if (mapping.generatedLine !== previousGeneratedLine) {
                previousGeneratedColumn = 0;
                while (mapping.generatedLine !== previousGeneratedLine) {
                    next += ';';
                    previousGeneratedLine++;
                }
            } else if (0 < i) {
                if (0 === mapping.compareByGeneratedPositionsInflated(mappings[i - 1])) {
                    continue;
                }

                next += ',';
            }

            next += base64vlq_encode(mapping.generatedColumn - previousGeneratedColumn);
            previousGeneratedColumn = mapping.generatedColumn;

            if (mapping.originalLine !== undefined && mapping.originalColumn !== undefined) {
                sourceIdx = 0;
                next += base64vlq_encode(sourceIdx - previousSource);
                previousSource = sourceIdx;

                // Lines are stored 0-based in SourceMap spec version 3
                next += base64vlq_encode(mapping.originalLine - 1 - previousOriginalLine);
                previousOriginalLine = mapping.originalLine - 1;

                next += base64vlq_encode(mapping.originalColumn - previousOriginalColumn);
                previousOriginalColumn = mapping.originalColumn;
            }

            result += next;
        }

        return result;
    }
}

module.exports = Generator;
