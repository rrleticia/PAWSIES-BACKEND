import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

export const VetModel = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().min(1).required(),
  specialty: Joi.string()
    .valid('cat', 'dog', 'cat_dog', 'CAT', 'DOG', 'CAT_DOG')
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'br'] },
    })
    .required(),
  username: Joi.string().required(),
  password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .doesNotInclude(['password', '12345678', 'aaaaaaaa'])
    .required(),
});
