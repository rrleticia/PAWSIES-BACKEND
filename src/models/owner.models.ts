import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

export const OwnerModel = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().required(),
});
