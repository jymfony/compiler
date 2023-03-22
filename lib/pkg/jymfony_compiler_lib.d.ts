/* tslint:disable */
/* eslint-disable */
/**
*
* * Returns the base 64 VLQ encoded value.
* 
* @param {number} value
* @returns {string}
*/
export function base64vlq_encode(value: number): string;
/**
*
* * Decodes the next base 64 VLQ value from the given string.
* 
* @param {string} str
* @param {number} index
* @returns {Int32Array}
*/
export function base64vlq_decode(str: string, index: number): Int32Array;
/**
*/
export class Mapping {
  free(): void;
/**
* @param {any} generated
* @param {any | undefined} original
* @param {string | undefined} source
* @param {string | undefined} name
*/
  constructor(generated: any, original?: any, source?: string, name?: string);
/**
*
*     * Comparator between two mappings with inflated source and name strings where
*     * the generated positions are compared.
*     
* @param {Mapping} other
* @returns {number}
*/
  compareByGeneratedPositionsInflated(other: Mapping): number;
/**
*
*     * Comparator between two mappings with deflated source and name indices where
*     * the generated positions are compared.
*     
* @param {Mapping} _this
* @param {Mapping} other
* @returns {number}
*/
  static compareByGeneratedPositionsDeflated(_this: Mapping, other: Mapping): number;
/**
*/
  generatedColumn: number;
/**
*/
  generatedLine: number;
/**
*/
  name?: string;
/**
*/
  originalColumn?: number;
/**
*/
  originalLine?: number;
/**
*/
  source?: string;
}
