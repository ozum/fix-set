const Joi = require('joi');
/**
 * Fix rule options to create a fix rule from given options.
 * @typedef  {Object}                             RuleConfig
 * @property {string|Array.<string>|Set.<string>} [elements]            - Strings which are covered by rule. They are compared by equal operator.
 * @property {string|Array.<string>|Set.<string>} [except]              - Fields which are not covered by rule.
 * @property {string|Array.<string>|Set.<string>} [prefixes]            - Strings which starts with given prefixes are covered by rule.
 * @property {string|Array.<string>|Set.<string>} [suffixes]            - Strings which ends with given suffixes are covered by rule.
 * @property {string|Array.<string>|Set.<string>} [exceptPrefixes]      - Strings which starts with given prefixes are NOT covered by rule.
 * @property {string|Array.<string>|Set.<string>} [exceptSuffixes]      - Strings which ends with given suffixes are NOT covered by rule.
 * @property {boolean}                            [replacePrefix]       - Whether it should prefix be stripped from start of field name
 * @property {boolean}                            [replaceSuffix]       - Whether it should suffix be stripped from end of field name.
 */
const ruleConfigSchema = {
  elements:       Joi.alternatives(Joi.array().items(Joi.string()), Joi.string(), Joi.object().type(Set)).optional(),
  except:         Joi.alternatives(Joi.array().items(Joi.string()), Joi.string(), Joi.object().type(Set)).optional(),
  prefixes:       Joi.alternatives(Joi.array().items(Joi.string()), Joi.string(), Joi.object().type(Set)).optional(),
  suffixes:       Joi.alternatives(Joi.array().items(Joi.string()), Joi.string(), Joi.object().type(Set)).optional(),
  exceptPrefixes: Joi.alternatives(Joi.array().items(Joi.string()), Joi.string(), Joi.object().type(Set)).optional(),
  exceptSuffixes: Joi.alternatives(Joi.array().items(Joi.string()), Joi.string(), Joi.object().type(Set)).optional(),
  replacePrefix:  Joi.boolean().optional(),
  replaceSuffix:  Joi.boolean().optional(),
};

module.exports = {
  ruleConfigSchema,
};
