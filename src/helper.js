// @flow

/**
 * Creates a new Set object from given input. If given value is a scalar, converts it to an array and then creates Set.
 * If input is undefined, returns empty Set.
 * @private
 * @param   {Array | string | number | Set | undefined}   input       - Input which a new Set will be created from.
 * @returns {Set}                                                     - Created Set or undefined.
 * @throws  {Error}                                                   - Throws error if input type cannot be converted to Set.
 */
function convertToSet<T: string|number>(input?: Array<T>|Set<T>|T): Set<T> {
  if (input === undefined) {
    return new Set();
  } else if (input instanceof Set || Array.isArray(input)) {
    return new Set(input);
  } else if (typeof input === 'string' || typeof input === 'number') {
    return new Set([input]);
  }

  throw new Error('Not convertible to Set.');
}

/**
 * Creates a new Array from given input. If given value is a scalar value, converts it to an array.
 * If input is undefined, returns empty array.
 * @private
 * @param   {Array | string | number | Set | undefined}  input      - Input which a new Set will be created from.
 * @returns {Array}                                                 - Created Set or undefined.
 * @throws  {Error}                                                 - Throws error if input type cannot be converted to Array.
 */
function convertToArray<T: string|number>(input?: Array<T>|Set<T>|T): Array<T> {
  if (input === undefined) {
    return [];
  } else if (Array.isArray(input)) {
    return input.slice(0);
  } else if (typeof input === 'string' || typeof input === 'number') {
    return [input];
  } else if (input instanceof Set) {
    return [...input];
  }

  throw new Error('Not convertible to Array.');
}

/**
 * Returns name if it getName any of given prefixes and suffixes. Applies replacement if requested. Returns undefined
 * if element getName none of the prefixes or suffixes.
 * @private
 * @param   {string}            element         - Element to test
 * @param   {Array.<RegExp>}    prefixes        - List of prefix regular expressions.
 * @param   {Array.<RegExp>}    suffixes        - List of suffix regular expressions.
 * @param   {boolean}           replacePrefix   - Whether to replace prefix in name.
 * @param   {boolean}           replaceSuffix   - Whether to replace suffix in name.
 * @returns {string|undefined}                  - Name of the lement if it getName any of the fixes after replacement rules applied.
 */
function getNameWithoutFix(element: string, prefixes: Array<RegExp>, suffixes: Array<RegExp>, replacePrefix: boolean, replaceSuffix: boolean): string | void { // eslint-disable-line max-len
  let name = element;
  const prefix = prefixes.find(f => element.match(f));
  const suffix = suffixes.find(f => element.match(f));

  if (prefix || suffix) {
    name = replacePrefix && prefix ? name.replace(prefix, '') : name;
    name = replaceSuffix && suffix ? name.replace(suffix, '') : name;

    return name;
  }

  return undefined;
}

// Used to match `RegExp`. See: https://github.com/lodash/lodash/blob/master/escapeRegExp.js
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = new RegExp(reRegExpChar.source);

/**
 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
 * @private
 * @param   {string} [string='']                - The string to escape.
 * @returns {string}                            - Returns the escaped string.
 * @see https://github.com/lodash/lodash/blob/master/escapeRegExp.js
 */
function escapeRegExp(string?: string = ''): string {
  return (string && reHasRegExpChar.test(string))
    ? string.replace(reRegExpChar, '\\$&')
    : string;
}

export { convertToArray, convertToSet, getNameWithoutFix, escapeRegExp };
