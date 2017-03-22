const Rule = require('./lib/rule');

const internalData = new WeakMap();

/**
 * Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
 * can be tested if they are covered by this rule.
 */
class FixSet {
  /**
   * Creates FixSet object. If no `include` or `exclude` parameters provided or empty configurations are provided, they
   * would be skipped.
   * @param {RuleConfig} [include]  - Inclusion rule configuration.
   * @param {RuleConfig} [exclude]  - Exclusion rule configuration.
   */
  constructor({ include, exclude }) {
    /**
     * Private attributes of object.
     * @private
     * @typedef  {Object} FixSet~Internal
     * @property {Rule} [include]   - Rule instance for included elements.
     * @property {Rule} [exclude]   - Rule instance for excluded elements.
     */
    const internal   = internalData.set(this, {}).get(this);
    internal.include = include && Object.keys(include).length > 0 && new Rule(include);
    internal.exclude = exclude && Object.keys(exclude).length > 0 && new Rule(exclude);
  }

  /**
   * Returns element name if it is covered by rule. Returns undefined otherwise. Prefix and suffix in element name
   * is replaced if requested by rule.
   * @param   {string}            element                   - Element name to test whether it is covered by rule.
   * @param   {Object}            [options={}]              - Options
   * @param   {boolean|undefined} [options.replacePrefix]   - Whether it should prefix be stripped from start of field name. Defaults to value given during object cunstruction.
   * @param   {boolean|undefined} [options.replaceSuffix]   - Whether it should suffix be stripped from end of field name. Defaults to value given during object cunstruction.
   * @returns {string|undefined}                            - Element name if it is covered by rule, undefined otherwise. Name getName prefix and suffix replaced if requested by rule.
   */
  getName(element, options = {}) {
    const internal      = internalData.get(this);
    const included      = internal.include && internal.include.has(element, options);  // Get name without prefixes and suffixes.
    const excluded      = internal.exclude && internal.exclude.has(element, options);  // Whether it is in exclude list.

    if ((internal.exclude && excluded.found) || (internal.include && !included.found)) {
      return undefined;
    } else if (internal.include && included.found) {
      return included.name;
    } else if (internal.exclude && !excluded.found) {
      return excluded.name;
    }

    return element;
  }

  /**
   * Returns whether element is covered by rules.
   * @param   {string}  element - Element name to test.
   * @returns {boolean}         - Whether element is covered by rule.
   */
  has(element) {
    return this.getName(element) !== undefined;
  }
}

module.exports = FixSet;
