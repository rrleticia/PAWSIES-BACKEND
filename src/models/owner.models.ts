import Joi, { ObjectSchema } from 'joi';

export const OwnerModel = Joi.object().keys({
  id: Joi.string(),
  email: Joi.string().required(),
  name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});
