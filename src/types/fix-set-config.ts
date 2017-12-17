/**
 * Fix rule configuration.
 * @typedef {Object} FixSetConfig
 * @property {RuleConfig}   include         - Configuration rules for included fields.
 * @property {RuleConfig}   exclude         - Configuration rules for excluded fields.
 */

import * as Joi from 'joi';
import { RuleConfig, RuleConfigSchema } from './rule-config';

type FixSetConfig = {
  include?: RuleConfig,
  exclude?: RuleConfig,
};

const FixSetConfigSchema = Joi.object({
  include: RuleConfigSchema.optional(),
  exclude: RuleConfigSchema.optional(),
}).unknown(false);

export { FixSetConfig, FixSetConfigSchema };
