const Base64VLQ = require('./Base64VLQ');
const Mapping = require('./Mapping');
const Position = require('../AST/Position');

const _charIsMappingSeparator = (str, index) => ';' === str[index] || ',' === str[index];

class Parser {
    /**
     * @param {string} mappings
     *
     * @returns {BTree<Mapping, true>}
     */
    static parseMappings(mappings) {
        let generatedLine = 1;
        let previousGeneratedColumn = 0;
        let previousOriginalLine = 0;
        let previousOriginalColumn = 0;
        let previousSource = 0;
        let previousName = 0;
        const length = mappings.length;
        let index = 0;
        const cachedSegments = {};

        /**
         * @type {Mapping[]}
         */
        const generatedMappings = [];
        let mapping, str, segment, end, value;

        while (index < length) {
            if (';' === mappings.charAt(index)) {
                generatedLine++;
                index++;
                previousGeneratedColumn = 0;
            } else if (',' === mappings.charAt(index)) {
                index++;
            } else {
                // Because each offset is encoded relative to the previous one,
                // Many segments often have the same encoding. We can exploit this
                // Fact by caching the parsed variable length fields of each segment,
                // Allowing us to avoid a second parse if we encounter the same
                // Segment again.
                for (end = index; end < length; end++) {
                    if (_charIsMappingSeparator(mappings, end)) {
                        break;
                    }
                }

                str = mappings.slice(index, end);
                segment = cachedSegments[str];
                if (segment) {
                    index += str.length;
                } else {
                    segment = [];
                    while (index < end) {
                        [ value, index ] = Base64VLQ.decode(mappings, index);
                        segment.push(value);
                    }

                    if (2 === segment.length) {
                        throw new Error('Found a source, but no line and column');
                    }

                    if (3 === segment.length) {
                        throw new Error('Found a source and line, but no column');
                    }

                    cachedSegments[str] = segment;
                }

                mapping = new Mapping(new Position(generatedLine, previousGeneratedColumn + segment[0]));
                previousGeneratedColumn = mapping.generatedColumn;

                if (1 < segment.length) {
                    // Original source.
                    mapping.source = previousSource + segment[1];
                    previousSource += segment[1];

                    // Original line.
                    mapping.originalLine = previousOriginalLine + segment[2];
                    previousOriginalLine = mapping.originalLine;
                    // Lines are stored 0-based
                    mapping.originalLine += 1;

                    // Original column.
                    mapping.originalColumn = previousOriginalColumn + segment[3];
                    previousOriginalColumn = mapping.originalColumn;

                    if (4 < segment.length) {
                        // Original name.
                        mapping.name = previousName + segment[4];
                        previousName += segment[4];
                    }
                }

                generatedMappings.push(mapping);
            }
        }

        const __generatedMappings = new BTree(Mapping.compareByGeneratedPositionsDeflated);
        generatedMappings.forEach(m => __generatedMappings.push(m, true));

        return __generatedMappings;
    }
}

module.exports = Parser;
