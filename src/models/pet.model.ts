import Joi, { ObjectSchema } from 'joi';

export const PetModel = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().required(),
  breed: Joi.string().required(),
  color: Joi.string().required(),
  age: Joi.number().required(),
  weight: Joi.number().required(),
  ownerID: Joi.number().required(),
});
