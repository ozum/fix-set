import { convertToArray, convertToSet, getNameWithoutFix, getRegExp } from './helper';
import { RuleConfig } from './types/index';

/**
 * Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
 * can be tested if they are covered by this rule.
 * @private
 */
class Rule {
  private _elements?:       Set<string>;    // Strings which are covered by rule.
  private _except?:         Set<string>;    // Fields which are not covered by rule.
  private _prefixes?:       Array<RegExp>;  // Strings which starts with given prefixes are covered by rule.
  private _suffixes?:       Array<RegExp>;  // Strings which ends with given suffixes are covered by rule.
  private _exceptPrefixes?: Array<RegExp>;  // Strings which starts with given prefixes are NOT covered by rule.
  private _exceptSuffixes?: Array<RegExp>;  // Strings which ends with given suffixes are NOT covered by rule.
  private _replacePrefix:   boolean;        // Whether it should prefix be stripped from start of field name.
  private _replaceSuffix:   boolean;        // Whether it should suffix be stripped from end of field name.

  /**
   * Creates FixSet object.
   * @param {RuleConfig} [config]  - Rule configuration.
   * @private
   */
  constructor(config: RuleConfig = {}) {
    this._elements        = config.elements ? convertToSet(config.elements) : undefined;
    this._except          = config.except ? convertToSet(config.except) : undefined;
    this._prefixes        = config.prefixes ? convertToArray(config.prefixes).map(s => getRegExp(s, 'prefix')) : undefined;
    this._suffixes        = config.suffixes ? convertToArray(config.suffixes).map(s => getRegExp(s, 'suffix')) : undefined;
    this._exceptPrefixes  = config.exceptPrefixes ? convertToArray(config.exceptPrefixes).map(s => getRegExp(s, 'prefix')) : undefined;
    this._exceptSuffixes  = config.exceptSuffixes ? convertToArray(config.exceptSuffixes).map(s => getRegExp(s, 'suffix')) : undefined;
    this._replacePrefix   = config.replacePrefix || false;
    this._replaceSuffix   = config.replaceSuffix || false;
  }

  /**
   * Returns element name without prefixes or suffixes if it is covered by rule. Returns undefined otherwise.
   * @param   {string}            element                   - Element to test whether it is covered by rule.
   * @param   {Object}            [options={}]              - Options
   * @param   {boolean|undefined} [options.replacePrefix]   - Whether it should prefix be stripped from start of field name. Defaults to value given during object cunstruction.
   * @param   {boolean|undefined} [options.replaceSuffix]   - Whether it should suffix be stripped from end of field name. Defaults to value given during object cunstruction.
   * @returns {{found: boolean, name: string }}             - Whether given element is covered by rule and element name after replacement if apply.
   */
  has(element: string, options: { replacePrefix?: boolean, replaceSuffix?: boolean } = {}): { found : boolean, name: string } {
    const replacePrefix = options.replacePrefix === undefined ? this._replacePrefix : options.replacePrefix;
    const replaceSuffix = options.replaceSuffix === undefined ? this._replaceSuffix : options.replaceSuffix;

    if (this._except && this._except.has(element)) {
      return { found: false, name: element };
    }

    if (this._elements && this._elements.has(element)) {
      return { found: true, name: element };
    }

      // If it is not included get prefix and suffix stripped name.
    if (this._exceptPrefixes || this._exceptSuffixes) {
      const exceptionName = getNameWithoutFix(element, this._exceptPrefixes, this._exceptSuffixes, replacePrefix, replaceSuffix);

      if (exceptionName !== undefined) {
        return { found: false, name: exceptionName };
      }
    }

      // If it is included get prefix and suffix stripped name.
    if (this._prefixes || this._suffixes) {
      const name = getNameWithoutFix(element, this._prefixes, this._suffixes, replacePrefix, replaceSuffix);

      return (name === undefined) ? { found: false, name: element } : { name, found: true };
    }

    return { found: true, name: element };
  }
}

export default Rule;
