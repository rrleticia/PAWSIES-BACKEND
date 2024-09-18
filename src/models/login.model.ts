import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

export const LoginModel = Joi.object().keys({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'br'] },
    })
    .required(),
  password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .doesNotInclude(['password', '12345678', 'aaaaaaaa']),
  access_token: [Joi.string(), Joi.number()],
});
