// @flow

import Rule from './rule';

const getInternal: (FixSet) => Internal = require('internal-data')(); // eslint-disable-line no-use-before-define

/**
 * Fix rule options to create a fix rule from given options.
 * @typedef  {Object}                             FixSetRuleConfig
 * @property {string|Array.<string>|Set.<string>} [elements]            - Strings which are covered by rule. They are compared by equal operator.
 * @property {string|Array.<string>|Set.<string>} [except]              - Fields which are not covered by rule.
 * @property {string|Array.<string>|Set.<string>} [prefixes]            - Strings which starts with given prefixes are covered by rule.
 * @property {string|Array.<string>|Set.<string>} [suffixes]            - Strings which ends with given suffixes are covered by rule.
 * @property {string|Array.<string>|Set.<string>} [exceptPrefixes]      - Strings which starts with given prefixes are NOT covered by rule.
 * @property {string|Array.<string>|Set.<string>} [exceptSuffixes]      - Strings which ends with given suffixes are NOT covered by rule.
 * @property {boolean}                            [replacePrefix]       - Whether it should prefix be stripped from start of field name
 * @property {boolean}                            [replaceSuffix]       - Whether it should suffix be stripped from end of field name.
 */
type FixSetRuleConfig = {|
  elements?:       string | Array<string> | Set<string>,
  except?:         string | Array<string> | Set<string>,
  prefixes?:       string | Array<string> | Set<string>,
  suffixes?:       string | Array<string> | Set<string>,
  exceptPrefixes?: string | Array<string> | Set<string>,
  exceptSuffixes?: string | Array<string> | Set<string>,
  replacePrefix?:  boolean,
  replaceSuffix?:  boolean,
|};

/**
 * Fix rule configuration.
 * @typedef {Object}              FixSetConfig
 * @property {FixSetRuleConfig}   include         - Configuration rules for included fields.
 * @property {FixSetRuleConfig}   exclude         - Configuration rules for excluded fields.
 */
type FixSetConfig = {|
  include: FixSetRuleConfig,
  exclude: FixSetRuleConfig,
|};

/**
 * Private attributes of object.
 * @private
 * @typedef  {Object} FixSet~Internal
 * @property {Rule} [include]   - Rule instance for included elements.
 * @property {Rule} [exclude]   - Rule instance for excluded elements.
 */
type Internal = {|
  include?: Rule,
  exclude?: Rule,
|}

/**
 * Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
 * can be tested if they are covered by this rule.
 */
class FixSet {
  /**
   * Creates FixSet object. If no `include` or `exclude` parameters provided or empty configurations are provided, they
   * would be skipped.
   * @param {FixSetRuleConfig} [include]  - Inclusion rule configuration.
   * @param {FixSetRuleConfig} [exclude]  - Exclusion rule configuration.
   */
  constructor({ include, exclude }: FixSetConfig) {
    const internal   = getInternal(this);
    internal.include = (include && Object.keys(include).length > 0) ? new Rule(include) : undefined;
    internal.exclude = (exclude && Object.keys(exclude).length > 0) ? new Rule(exclude) : undefined;
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
  getName(element: string, options: { replacePrefix?: boolean, replaceSuffix?: boolean } = {}): string | void {
    const internal      = getInternal(this);
    const included      = internal.include && internal.include.has(element, options);  // Get name without prefixes and suffixes.
    const excluded      = internal.exclude && internal.exclude.has(element, options);  // Whether it is in exclude list.

    if ((excluded && excluded.found) || (included && !included.found)) {
      return undefined;
    } else if (included && included.found) {
      return included.name;
    } else if (excluded && !excluded.found) {
      return excluded.name;
    }

    return element;
  }

  /**
   * Returns whether element is covered by rules.
   * @param   {string}  element - Element name to test.
   * @returns {boolean}         - Whether element is covered by rule.
   */
  has(element: string): boolean {
    return this.getName(element) !== undefined;
  }
}

export type { FixSetRuleConfig, FixSetConfig };

export default FixSet;
