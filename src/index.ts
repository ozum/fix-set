import * as Joi from 'joi';
import Rule     from './rule';
import { RuleConfig, FixSetConfig, FixSetConfigSchema, RuleConfigSchema } from './types/index';

/**
 * Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
 * can be tested if they are covered by this rule.
 */
class FixSet {
  private _include?: Rule;  // Rule instance for included elements.
  private _exclude?: Rule;  // Rule instance for excluded elements.

  /**
   * Creates FixSet object. If no `include` or `exclude` parameters provided or empty configurations are provided, they
   * would be skipped.
   * @param {FixSetConfig}  [config]  - Configuration.
   * @return {FixSet}                 - Object
   */
  constructor(config: FixSetConfig = {}) {
    const validation = Joi.validate(config, FixSetConfigSchema);
    if (validation.error) { throw new Error(validation.error.annotate()); }

    const { include, exclude } = config;

    this._include = (include && Object.keys(include).length > 0) ? new Rule(include) : undefined;
    this._exclude = (exclude && Object.keys(exclude).length > 0) ? new Rule(exclude) : undefined;
  }

  /**
   * Returns element name if it is covered by rule. Returns undefined otherwise. Prefix and suffix in element name
   * is replaced if requested by rule.
   * @param  {string}              element                   - Element name to test whether it is covered by rule.
   * @param  {Object}              [options={}]              - Options
   * @param  {boolean | undefined} [options.replacePrefix]   - Whether it should prefix be stripped from start of field name. Defaults to value given during object cunstruction.
   * @param  {boolean | undefined} [options.replaceSuffix]   - Whether it should suffix be stripped from end of field name. Defaults to value given during object cunstruction.
   * @return {string | undefined}                            - Element name if it is covered by rule, undefined otherwise. Name getName prefix and suffix replaced if requested by rule.
   */
  getName(element: string, options: { replacePrefix?: boolean, replaceSuffix?: boolean } = {}): string | void {
    const excluded      = this._exclude && this._exclude.has(element, options);  // Whether it is in exclude list.
    const included      = this._include && this._include.has(element, options);  // Get name without prefixes and suffixes.

    if ((excluded && excluded.found) || (included && !included.found))  { return undefined; }
    if (included && included.found)                                     { return included.name; }
    if (excluded && !excluded.found)                                    { return excluded.name; }

    return element;
  }

  /**
   * Returns whether element is covered by rules.
   * @param  {string}  element - Element name to test.
   * @return {boolean}         - Whether element is covered by rule.
   */
  has(element: string): boolean {
    return this.getName(element) !== undefined;
  }
}

export { RuleConfig, FixSetConfig };
export default FixSet;
