// @flow

// import Joi from 'joi';
// import { RuleConfigSchema } from './rule-config';
import type { RuleConfig } from './rule-config';

/**
 * Fix rule configuration.
 * @typedef {Object}              FixSetConfig
 * @property {RuleConfig}   include         - Configuration rules for included fields.
 * @property {RuleConfig}   exclude         - Configuration rules for excluded fields.
 */
export type FixSetConfig = {|
  include?: RuleConfig,
  exclude?: RuleConfig,
|};

1; // eslint-disable-line no-unused-expressions

// const FixSetConfigSchema = Joi.object({
//   include: RuleConfigSchema.optional(),
//   exclude: RuleConfigSchema.optional(),
// }).unknown(false);

// export type { FixSetConfig };
// export { FixSetConfigSchema };
