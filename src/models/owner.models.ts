import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

export const OwnerModel = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().required(),
  role: Joi.string().valid(
    'ANONYMOUS',
    'ADMIN',
    'VET',
    'OWNER',
    'anonymous',
    'admin',
    'vet',
    'owner'
  ),
  username: Joi.string().required(),
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
    .doesNotInclude(['password', '12345678', 'aaaaaaaa'])
    .required(),
});
