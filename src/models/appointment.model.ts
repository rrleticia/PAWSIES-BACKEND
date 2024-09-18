import Joi from 'joi';
import coreJoi from 'joi';
import joiDate from '@joi/date';

const joi = coreJoi.extend(joiDate) as typeof coreJoi;

export const AppointmentModel = Joi.object().keys({
  id: Joi.string().trim().min(1),
  date: joi.date().format('DD/MM/YYYY').required(),
  hour: Joi.string()
    .pattern(new RegExp('[0-9][0-9][H,h]'))
    .valid(
      '00H',
      '01H',
      '02H',
      '03H',
      '04H',
      '05H',
      '06H',
      '07H',
      '09H',
      '10H',
      '11H',
      '12H',
      '13H',
      '14H',
      '15H',
      '16H',
      '17H',
      '18H',
      '19H',
      '20H',
      '21H',
      '22H',
      '23H',
      '24H'
    )
    .required(),
  status: Joi.boolean().valid(true, false).required(),
  examination: Joi.string()
    .trim()
    .min(1)
    .valid('routine', 'urgent', 'surgery', 'ROUTINE', 'URGENT', 'SURGERY')
    .required(),
  observations: Joi.string().trim().min(1).required(),
  vetID: Joi.string().required(),
  petID: Joi.string().required(),
  ownerID: Joi.string().required(),
});
