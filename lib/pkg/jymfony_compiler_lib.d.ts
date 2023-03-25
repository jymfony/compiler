/* tslint:disable */
/* eslint-disable */
/**
* @param {string} mappings
* @returns {any}
*/
export function parseMappings(mappings: string): any;
/**
* Prepares stack trace using V8 stack trace API.
* @param {any} error
* @param {any[]} stack
* @param {string | undefined} previous
* @returns {string}
*/
export function prepareStackTrace(error: any, stack: any[], previous?: string): string;
/**
* Registers a source map.
* @param {string} filename
* @param {any} mappings
*/
export function registerSourceMap(filename: string, mappings: any): void;
/**
*/
export function main(): void;
/**
*/
export class Generator {
  free(): void;
/**
*
*    /// Constructor.
*     
* @param {string | undefined} file
* @param {boolean | undefined} skip_validation
*/
  constructor(file?: string, skip_validation?: boolean);
/**
* Add a single mapping from original source line and column to the generated
* source's line and column for this source map being created.
* @param {any} generated
* @param {any | undefined} original
*/
  addMapping(generated: any, original?: any): void;
/**
* @param {string} original
* @param {(string)[]} sources
* @param {(string)[]} sources_content
*/
  applyMapping(original: string, sources: (string)[], sources_content: (string)[]): void;
/**
* @returns {Array<any>}
*/
  getMappings(): Array<any>;
/**
* Externalize the source map.
* @returns {any}
*/
  toJSON(): any;
/**
* Render the source map being generated to a string.
* @returns {string}
*/
  toString(): string;
/**
* Set the source content for a source file.
*/
  sourceContent: string;
}
/**
*/
export class Mapping {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
/**
* @returns {string}
*/
  __getClassname(): string;
/**
* @param {any} generated
* @param {any | undefined} original
* @param {string | undefined} source
* @param {string | undefined} name
*/
  constructor(generated: any, original?: any, source?: string, name?: string);
/**
* @returns {number | undefined}
*/
  source_index(): number | undefined;
/**
* @param {string | undefined} val
*/
  set_source(val?: string): void;
/**
* @param {number | undefined} val
*/
  set_source_index(val?: number): void;
/**
* @param {string | undefined} val
*/
  set_name(val?: string): void;
/**
* @param {number | undefined} val
*/
  set_name_index(val?: number): void;
/**
* Comparator between two mappings with inflated source and name strings where
* the generated positions are compared.
* @param {Mapping} other
* @returns {number}
*/
  compare_by_generated_positions_inflated(other: Mapping): number;
/**
* Comparator between two mappings with deflated source and name indices where
* the generated positions are compared.
* @param {Mapping} _this
* @param {Mapping} other
* @returns {number}
*/
  static compareByGeneratedPositionsDeflated(_this: Mapping, other: Mapping): number;
/**
*/
  readonly generatedColumn: number;
/**
*/
  readonly generatedLine: number;
/**
*/
  readonly name: string | undefined;
/**
*/
  readonly originalColumn: number | undefined;
/**
*/
  readonly originalLine: number | undefined;
/**
*/
  readonly source: string | undefined;
}
