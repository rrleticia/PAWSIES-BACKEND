import Joi, { ObjectSchema } from 'joi';

export const AppointmentModel = Joi.object().keys({
  id: Joi.string(),
  date: Joi.date().required(),
  hour: Joi.string().required(),
  status: Joi.boolean().required(),
  examination: Joi.string().required(),
  observations: Joi.string().required(),
  vetID: Joi.string().required(),
  petID: Joi.string().required(),
  ownerID: Joi.string().required(),
});
