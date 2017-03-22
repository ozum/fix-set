const util   = require('./util');
const lodash = require('lodash');

const internalData = new WeakMap();

/**
 * Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
 * can be tested if they are covered by this rule.
 * @private
 */
class Rule {
  /**
   * Creates FixSet object.
   * @param {RuleConfig} config  - Rule configuration.
   * @private
   */
  constructor(config = {}) {
    const { prefixes, suffixes, exceptPrefixes, exceptSuffixes, replacePrefix, replaceSuffix, elements, except } = config;

    /**
     * Private attributes of object.
     * @typedef   {Object}  Rule~Internal
     * @private
     * @property  {Array.<RegExp>}  prefixes            - Strings which starts with given prefixes are covered by rule.
     * @property  {Array.<RegExp>}  suffixes            - Strings which ends with given suffixes are covered by rule.
     * @property  {Array.<RegExp>}  exceptPrefixes      - Strings which starts with given prefixes are NOT covered by rule.
     * @property  {Array.<RegExp>}  exceptSuffixes      - Strings which ends with given suffixes are NOT covered by rule.
     * @property  {boolean}         [replacePrefix]     - Whether it should prefix be stripped from start of field name.
     * @property  {boolean}         [replaceSuffix]     - Whether it should suffix be stripped from end of field name.
     * @property  {Set.<string>}    elements            - Strings which are covered by rule.
     * @property  {Set.<string>}    except              - Fields which are not covered by rule.
     */
    const internal = internalData.set(this, {}).get(this);

    internal.elements        = util.convertToSet(elements);
    internal.except          = util.convertToSet(except);
    internal.prefixes        = util.convertToArray(prefixes).map(s => new RegExp(`^${lodash.escapeRegExp(s)}`));
    internal.suffixes        = util.convertToArray(suffixes).map(s => new RegExp(`${lodash.escapeRegExp(s)}$`));
    internal.exceptPrefixes  = util.convertToArray(exceptPrefixes).map(s => new RegExp(`^${lodash.escapeRegExp(s)}`));
    internal.exceptSuffixes  = util.convertToArray(exceptSuffixes).map(s => new RegExp(`${lodash.escapeRegExp(s)}$`));
    internal.replacePrefix   = replacePrefix;
    internal.replaceSuffix   = replaceSuffix;
  }

  /**
   * Returns element name without prefixes or suffixes if it is covered by rule. Returns undefined otherwise.
   * @param   {string}            element                   - Element to test whether it is covered by rule.
   * @param   {Object}            [options={}]              - Options
   * @param   {boolean|undefined} [options.replacePrefix]   - Whether it should prefix be stripped from start of field name. Defaults to value given during object cunstruction.
   * @param   {boolean|undefined} [options.replaceSuffix]   - Whether it should suffix be stripped from end of field name. Defaults to value given during object cunstruction.
   * @returns {{found: boolean, name: string }}             - Whether given element is covered by rule and element name after replacement if apply.
   */
  has(element, options = {}) {
    const internal      = internalData.get(this);
    const replacePrefix = options.replacePrefix === undefined ? internal.replacePrefix : options.replacePrefix;
    const replaceSuffix = options.replaceSuffix === undefined ? internal.replaceSuffix : options.replaceSuffix;

    if (internal.except.has(element)) {
      return { found: false, name: element };
    }

    if (internal.elements.has(element)) {
      return { found: true, name: element };
    }

    // If it is not included get replaced name.
    const exceptionName = util.getNameWithoutFix(element, internal.exceptPrefixes, internal.exceptSuffixes, replacePrefix, replaceSuffix);

    if (exceptionName !== undefined) {
      return { found: false, name: exceptionName };
    }

    // If it is included get replaced name.
    const name = util.getNameWithoutFix(element, internal.prefixes, internal.suffixes, replacePrefix, replaceSuffix);

    if (name !== undefined) {
      return { found: true, name };
    }

    return { found: false, name: element };
  }
}

module.exports = Rule;
