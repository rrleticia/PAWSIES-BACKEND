import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

export const VetModel = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().min(1).required(),
  specialty: Joi.string()
    .valid('cat', 'dog', 'cat_dog', 'CAT', 'DOG', 'CAT_DOG')
    .required(),
});
