import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

export const OwnerModel = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().trim().min(1).required(),
  username: Joi.string().trim().min(6).required(),
  email: Joi.string()
    .trim()
    .min(1)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'br'] },
    })
    .required(),
  password: joiPassword
    .string()
    .trim()
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
