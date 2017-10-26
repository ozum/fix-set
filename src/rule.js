// @flow

import { convertToArray, convertToSet, getNameWithoutFix, escapeRegExp } from './helper';
import type { FixSetRuleConfig } from './index';

const getInternal: (Rule) => Internal = require('internal-data')(); // eslint-disable-line no-use-before-define

/**
 * Private attributes of object.
 * @typedef   {Object}  Rule~Internal
 * @private
 * @property  {Set.<string>}    elements            - Strings which are covered by rule.
 * @property  {Set.<string>}    except              - Fields which are not covered by rule.
 * @property  {Array.<RegExp>}  prefixes            - Strings which starts with given prefixes are covered by rule.
 * @property  {Array.<RegExp>}  suffixes            - Strings which ends with given suffixes are covered by rule.
 * @property  {Array.<RegExp>}  exceptPrefixes      - Strings which starts with given prefixes are NOT covered by rule.
 * @property  {Array.<RegExp>}  exceptSuffixes      - Strings which ends with given suffixes are NOT covered by rule.
 * @property  {boolean}         [replacePrefix]     - Whether it should prefix be stripped from start of field name.
 * @property  {boolean}         [replaceSuffix]     - Whether it should suffix be stripped from end of field name.
 */
type Internal = {|
  elements:       Set<string>,
  except:         Set<string>,
  prefixes:       Array<RegExp>,
  suffixes:       Array<RegExp>,
  exceptPrefixes: Array<RegExp>,
  exceptSuffixes: Array<RegExp>,
  replacePrefix:  boolean,
  replaceSuffix:  boolean,
|};

/**
 * Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
 * can be tested if they are covered by this rule.
 * @private
 */
class Rule {
  /**
   * Creates FixSet object.
   * @param {FixSetRuleConfig} config  - Rule configuration.
   * @private
   */
  constructor(config: FixSetRuleConfig) {
    const {
      prefixes, suffixes, exceptPrefixes, exceptSuffixes, replacePrefix, replaceSuffix, elements, except,
    } = config || {};

    const internal = getInternal(this);

    internal.elements        = convertToSet(elements);
    internal.except          = convertToSet(except);
    internal.prefixes        = convertToArray(prefixes).map(s => new RegExp(`^${escapeRegExp(s)}`));
    internal.suffixes        = convertToArray(suffixes).map(s => new RegExp(`${escapeRegExp(s)}$`));
    internal.exceptPrefixes  = convertToArray(exceptPrefixes).map(s => new RegExp(`^${escapeRegExp(s)}`));
    internal.exceptSuffixes  = convertToArray(exceptSuffixes).map(s => new RegExp(`${escapeRegExp(s)}$`));
    internal.replacePrefix   = replacePrefix || false;
    internal.replaceSuffix   = replaceSuffix || false;
  }

  /**
   * Returns element name without prefixes or suffixes if it is covered by rule. Returns undefined otherwise.
   * @param   {string}            element                   - Element to test whether it is covered by rule.
   * @param   {Object}            [options={}]              - Options
   * @param   {boolean|undefined} [options.replacePrefix]   - Whether it should prefix be stripped from start of field name. Defaults to value given during object cunstruction.
   * @param   {boolean|undefined} [options.replaceSuffix]   - Whether it should suffix be stripped from end of field name. Defaults to value given during object cunstruction.
   * @returns {{found: boolean, name: string }}             - Whether given element is covered by rule and element name after replacement if apply.
   */
  has(element: string, options: { replacePrefix?: boolean, replaceSuffix?: boolean } = {}): {| found: boolean, name: string |} {
    const internal      = getInternal(this);
    const replacePrefix = options.replacePrefix === undefined ? internal.replacePrefix : options.replacePrefix;
    const replaceSuffix = options.replaceSuffix === undefined ? internal.replaceSuffix : options.replaceSuffix;

    if (internal.except.has(element)) {
      return { found: false, name: element };
    }

    if (internal.elements.has(element)) {
      return { found: true, name: element };
    }

    // If it is not included get replaced name.
    const exceptionName = getNameWithoutFix(element, internal.exceptPrefixes, internal.exceptSuffixes, replacePrefix, replaceSuffix);

    if (exceptionName !== undefined) {
      return { found: false, name: exceptionName };
    }

    // If it is included get replaced name.
    const name = getNameWithoutFix(element, internal.prefixes, internal.suffixes, replacePrefix, replaceSuffix);

    if (name !== undefined) {
      return { found: true, name };
    }

    return { found: false, name: element };
  }
}

export default Rule;
