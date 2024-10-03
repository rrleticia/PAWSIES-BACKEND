import Joi from 'joi';
import coreJoi from 'joi';
import joiDate from '@joi/date';

const joi = coreJoi.extend(joiDate) as typeof coreJoi;

export const AppointmentModel = Joi.object().keys({
  id: Joi.string().trim().min(1),
  date: joi.date().format('DD/MM/YYYY').required(),
  hour: Joi.string()
    .uppercase()
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
  status: Joi.string()
    .trim()
    .min(1)
    .valid(
      'scheduled',
      'SCHEDULED',
      'confirmed',
      'CONFIRMED',
      'rescheduled',
      'RESCHEDULED',
      'cancelled',
      'CANCELLED',
      'completed',
      'COMPLETED',
      'no_show',
      'NO_SHOW',
      'in_progress',
      'IN_PROGRESS'
    )
    .required(),
  examination: Joi.string()
    .trim()
    .min(1)
    .valid(
      'check_up',
      'CHECK_UP',
      'follow_up',
      'FOLLOW_UP',
      'routine',
      'ROUTINE',
      'urgent',
      'URGENT',
      'emergency',
      'EMERGENCY',
      'lab_tests',
      'LAB_TESTS',
      'x_ray',
      'X_RAY',
      'ultrasound',
      'ULTRASOUND',
      'surgery',
      'SURGERY',
      'vaccination',
      'VACCINATION'
    )
    .required(),
  observations: Joi.string().trim().min(1).required(),
  vetID: Joi.string().required(),
  petID: Joi.string().required(),
  ownerID: Joi.string().required(),
});
