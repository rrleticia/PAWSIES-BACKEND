import coreJoi from 'joi';
import joiDate from '@joi/date';
import { PetModel } from './pet.model';

const Joi = coreJoi.extend(joiDate) as typeof coreJoi;

export const AppointmentModel = Joi.object().keys({
  id: Joi.string().trim().min(1).allow(''),
  date: Joi.date().format('DD/MM/YYYY').required(),
  hour: Joi.string()
    .pattern(new RegExp('^[0-9]{2}:[0-9]{2}$'))
    .custom((value, helpers) => {
      const [hours, minutes] = value.split(':').map(Number);
      if (hours < 0 || hours > 23) {
        return helpers.error('any.invalid', {
          message: 'Invalid hour value. Must be between 00 and 23.',
        });
      }
      if (minutes < 0 || minutes > 59) {
        return helpers.error('any.invalid', {
          message: 'Invalid minute value. Must be between 00 and 59.',
        });
      }
      return value;
    }, 'Hour and Minute validation')
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
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  pet: PetModel,
});
