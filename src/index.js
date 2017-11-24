// @flow

// import Joi    from 'joi';
import InternalData from 'internal-data';
import Rule   from './rule';
import type { RuleConfig, FixSetConfig } from './types';

/**
 * Private attributes of object.
 * @private
 * @typedef  {Object} Internal
 * @property {Rule} [include]   - Rule instance for included elements.
 * @property {Rule} [exclude]   - Rule instance for excluded elements.
 */
type Internal = {|
  include?: Rule,
  exclude?: Rule,
|}

const internalData: InternalData<FixSet, Internal> = new InternalData(); // eslint-disable-line no-use-before-define

/**
 * Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
 * can be tested if they are covered by this rule.
 */
class FixSet {
  deneme: string;

  /**
   * Creates FixSet object. If no `include` or `exclude` parameters provided or empty configurations are provided, they
   * would be skipped.
   * @param {Object}           [config]          - Configuration.
   * @param {RuleConfig} [config.include]  - Inclusion rule configuration.
   * @param {RuleConfig} [config.exclude]  - Exclusion rule configuration.
   */
  constructor(config?: FixSetConfig) {
    // const validation = Joi.validate(config, FixSetConfigSchema);
    // if (validation.error) { throw new Error(validation.error.annotate()); }

    const internal   = internalData.get(this);
    const { include, exclude } = config || {};

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
    const internal      = internalData.get(this);
    const excluded      = internal.exclude && internal.exclude.has(element, options);  // Whether it is in exclude list.
    const included      = internal.include && internal.include.has(element, options);  // Get name without prefixes and suffixes.


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

export type { RuleConfig, FixSetConfig };

export default FixSet;
