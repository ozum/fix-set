import * as lodash from 'lodash';

/**
 * Creates a new Set object from given input. If given value is a scalar, converts it to an array and then creates Set.
 * If input is undefined, returns empty Set.
 * @private
 * @param   {Array | string | RegExp | Set | undefined}   input       - Input which a new Set will be created from.
 * @returns {Set}                                                     - Created Set or undefined.
 * @throws  {Error}                                                   - Throws error if input type cannot be converted to Set.
 */
function convertToSet<T extends string | RegExp>(input?: Array<T> | Set<T> | T): Set<T> {
  if (input === undefined)                          { return new Set(); }
  if (input instanceof Set || Array.isArray(input)) { return new Set(input); }

  return new Set([input]);
}

/**
 * Creates a new Array from given input. If given value is a scalar value, converts it to an array.
 * If input is undefined, returns empty array.
 * @private
 * @param   {Array | string | RegExp | Set | undefined}  input      - Input which a new Set will be created from.
 * @returns {Array}                                                 - Created Set or undefined.
 * @throws  {Error}                                                 - Throws error if input type cannot be converted to Array.
 */
function convertToArray<T extends string | RegExp>(input?: Array<T> | Set<T> | T): Array<T> {
  if (input === undefined)  { return []; }
  if (Array.isArray(input)) { return input.slice(0); }
  if (input instanceof Set) { return [...input]; }

  return [input];
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
function getNameWithoutFix(element: string, prefixes: Array<RegExp> | undefined, suffixes: Array<RegExp> | undefined, replacePrefix: boolean, replaceSuffix: boolean): string | void {
  let name = element;

  const prefix = prefixes && prefixes.find(f => element.search(f) > -1);
  const suffix = suffixes && suffixes.find(f => element.search(f) > -1);

  if (prefix || suffix) {
    name = replacePrefix && prefix ? name.replace(prefix, '') : name;
    name = replaceSuffix && suffix ? name.replace(suffix, '') : name;

    return name;
  }

  return undefined;
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
function getRegExp(input: string | RegExp | undefined, type: 'prefix' | 'suffix'): RegExp {
  if (input instanceof RegExp) {
    const { source } = input;
    if (type === 'prefix' && source.charAt(0) !== '^') {
      throw new Error('Prefix regular expression must begin with "^"');
    } else if (type === 'suffix' && source.charAt(source.length - 1) !== '$') {
      throw new Error('Suffix regular expression must end with "$"');
    }

    return input;
  }
  if (input === undefined) {
    return new RegExp('');
  }

  let source = lodash.escapeRegExp(input);
  source = (type === 'prefix') ? `^${source}` : `${source}$`;

  return new RegExp(source);
}

export { convertToArray, convertToSet, getNameWithoutFix, getRegExp };
