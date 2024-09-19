import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

export const UserModel = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().trim().min(1).required(),
  role: Joi.string()
    .trim()
    .uppercase()
    .valid(
      'ANONYMOUS',
      'ADMIN',
      'VET',
      'OWNER',
      'anonymous',
      'admin',
      'vet',
      'owner'
    ),
  username: Joi.string().trim().min(6).required(),
  email: Joi.string()
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
  vetID: Joi.string().allow(null),
  ownerID: Joi.string().allow(null),
});
