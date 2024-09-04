import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

export const OwnerModel = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().required(),
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
  user: {
    userId: 'cm0n56ts20000byl4l7umql4y',
    iat: 1725411066,
    exp: 1725418266,
  },
});
