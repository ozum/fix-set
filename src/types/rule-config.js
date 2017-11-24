// @flow

// import Joi from 'joi';

/**
 * Fix rule options to create a fix rule from given options. Prefix and suffix parameters can be either string
 * or regular expression. If they are provided as regular expressions, they must begin with `^` or end with `$`.
 * If no `prefixes` and `suffixes` provided, it is assumed all strings are included except `exceptPrefixes`
 * and `exceptSuffixes`.
 * @typedef  {Object} RuleConfig
 * @property {string|Array.<string>|Set.<string>}                      [element]             - Strings which are covered by rule. They are compared by equal operator.
 * @property {string|Array.<string>|Set.<string>}                      [except]              - Fields which are not covered by rule.
 * @property {string|RegExp|Array.<string|RegExp>|Set.<string|RegExp>} [prefixes]            - Strings which starts with given prefixes are covered by rule.
 * @property {string|RegExp|Array.<string|RegExp>|Set.<string|RegExp>} [suffixes]            - Strings which ends with given suffixes are covered by rule.
 * @property {string|RegExp|Array.<string|RegExp>|Set.<string|RegExp>} [exceptPrefixes]      - Strings which starts with given prefixes are NOT covered by rule.
 * @property {string|RegExp|Array.<string|RegExp>|Set.<string|RegExp>} [exceptSuffixes]      - Strings which ends with given suffixes are NOT covered by rule.
 * @property {boolean}                                                 [replacePrefix]       - Whether it should prefix be stripped from start of field name
 * @property {boolean}                                                 [replaceSuffix]       - Whether it should suffix be stripped from end of field name.
 */
export type RuleConfig = {|
  elements?:       string | Array<string> | Set<string>,
  except?:         string | Array<string> | Set<string>,
  prefixes?:       Array<string | RegExp> | Set<string | RegExp> | string | RegExp,
  suffixes?:       Array<string | RegExp> | Set<string | RegExp> | string | RegExp,
  exceptPrefixes?: Array<string | RegExp> | Set<string | RegExp> | string | RegExp,
  exceptSuffixes?: Array<string | RegExp> | Set<string | RegExp> | string | RegExp,
  replacePrefix?:  boolean,
  replaceSuffix?:  boolean,
|};

1; // eslint-disable-line no-unused-expressions

// Allow Array<string | RegExp) or string or RegExp or Set.
// const PrefixSchema = Joi.alternatives(
//   Joi.array().items(Joi.string(), Joi.object().type(RegExp)),
//   Joi.string(),
//   Joi.object().type(RegExp),
//   Joi.object().type(Set),
// );

// const RuleConfigSchema = Joi.object({
//   elements:       Joi.alternatives(Joi.array().items(Joi.string()), Joi.string(), Joi.object().type(Set)).optional(),
//   except:         Joi.alternatives(Joi.array().items(Joi.string()), Joi.string(), Joi.object().type(Set)).optional(),
//   prefixes:       PrefixSchema,
//   suffixes:       PrefixSchema,
//   exceptPrefixes: PrefixSchema,
//   exceptSuffixes: PrefixSchema,
//   replacePrefix:  Joi.boolean().optional(),
//   replaceSuffix:  Joi.boolean().optional(),
// }).unknown(false);

// export type { RuleConfig };
// export { RuleConfigSchema };
