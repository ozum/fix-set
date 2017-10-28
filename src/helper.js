// @flow

/**
 * Creates a new Set object from given input. If given value is a scalar, converts it to an array and then creates Set.
 * If input is undefined, returns empty Set.
 * @private
 * @param   {Array | string | RegExp | Set | undefined}   input       - Input which a new Set will be created from.
 * @returns {Set}                                                     - Created Set or undefined.
 * @throws  {Error}                                                   - Throws error if input type cannot be converted to Set.
 */
function convertToSet<T: string|RegExp>(input?: Array<T>|Set<T>|T): Set<T> {
  if (input === undefined) {
    return new Set();
  } else if (input instanceof Set || Array.isArray(input)) {
    return new Set(input);
  } else if (typeof input === 'string' || input instanceof RegExp) {
    return new Set([input]);
  }

  throw new Error('Not convertible to Set.');
}

/**
 * Creates a new Array from given input. If given value is a scalar value, converts it to an array.
 * If input is undefined, returns empty array.
 * @private
 * @param   {Array | string | RegExp | Set | undefined}  input      - Input which a new Set will be created from.
 * @returns {Array}                                                 - Created Set or undefined.
 * @throws  {Error}                                                 - Throws error if input type cannot be converted to Array.
 */
function convertToArray<T: string|RegExp>(input?: Array<T>|Set<T>|T): Array<T> {
  if (input === undefined) {
    return [];
  } else if (Array.isArray(input)) {
    return input.slice(0);
  } else if (input instanceof Set) {
    return [...input];
  } else if (typeof input === 'string' || input instanceof RegExp) {
    return [input];
  }

  throw new Error('Not convertible to Array.');
}

/**
 * Returns name if it has any of given prefixes and suffixes. Applies replacement if requested. Returns undefined
 * if element has none of the prefixes or suffixes.
 * @private
 * @param   {string}            element         - Element to test
 * @param   {Array.<RegExp>}    prefixes        - List of prefix regular expressions.
 * @param   {Array.<RegExp>}    suffixes        - List of suffix regular expressions.
 * @param   {boolean}           replacePrefix   - Whether to replace prefix in name.
 * @param   {boolean}           replaceSuffix   - Whether to replace suffix in name.
 * @returns {string|undefined}                  - Name of the lement if it getName any of the fixes after replacement rules applied.
 */
function getNameWithoutFix(element: string, prefixes?: Array<RegExp>, suffixes?: Array<RegExp>, replacePrefix: boolean, replaceSuffix: boolean): string | void { // eslint-disable-line max-len
  let name = element;

  const prefix = prefixes && prefixes.find(f => element.match(f));
  const suffix = suffixes && suffixes.find(f => element.match(f));

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
 * @param   {string} string                     - The string to escape.
 * @returns {string}                            - Returns the escaped string.
 * @see https://github.com/lodash/lodash/blob/master/escapeRegExp.js
 */
function escapeRegExp(string: string): string {
  return (string && reHasRegExpChar.test(string))
    ? string.replace(reRegExpChar, '\\$&')
    : string;
}

/**
 * Converts prefix or suffix strings into regular expression after adding `^` or `$`. Also escapes regular expression
 * characters. If input is already a regular expression, returns it as it is.
 * @private
 * @param   {string|RegExp }  input             - Input to produce regular expression from.
 * @param   {string}          type              - Type of input. (`prefix` or `suffix`). This is used to determine `^` or `$`
 * @returns {RegExp}                            - Regular expression to use.
 * @throws  {Error}                             - If input is already RegExp and does not have `^` or `$` as necessary, this function throws error.
 */
function getRegExp(input?: string|RegExp, type: 'prefix'|'suffix'): RegExp {
  if (input instanceof RegExp) {
    const { source } = input;
    if (type === 'prefix' && source.charAt(0) !== '^') {
      throw new Error('Prefix regular expression must begin with "^"');
    } else if (type === 'suffix' && source.charAt(source.length - 1) !== '$') {
      throw new Error('Suffix regular expression must end with "$"');
    }

    return input;
  } else if (input === undefined) {
    return new RegExp('');
  }

  let source = escapeRegExp(input);
  source = (type === 'prefix') ? `^${source}` : `${source}$`;

  return new RegExp(source);
}

export { convertToArray, convertToSet, getNameWithoutFix, escapeRegExp, getRegExp };
