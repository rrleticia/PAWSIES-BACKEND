import Joi from 'joi';

export const PetModel = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().min(1).required(),
  breed: Joi.string().min(1).required(),
  color: Joi.string().min(1).required(),
  age: Joi.number().min(1).required(),
  weight: Joi.number().min(0).required(),
  type: Joi.string()
    .valid('cat', 'dog', 'unknown', 'CAT', 'DOG', 'UNKNOWN')
    .required(),
  ownerID: Joi.number().required(),
});
