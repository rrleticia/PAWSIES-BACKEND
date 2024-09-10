import { UserNotFoundError, UserUnauthorizedError } from '../../errors';
import { UserTokenUpdateError } from '../../errors/user/UserTokenUpdateError';
import { IUserRepository, LoginUser, User } from '../../infra';
import { getToken, UnknownError } from '../../shared';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

let refreshTokens = [] as string[];

export class AuthenticationService {
  constructor(private readonly repository: IUserRepository) {}

  public async login(
    email: string,
    password: string
  ): Promise<{ token: string; loggedUser: LoginUser }> {
    try {
      const user = await this.repository.findOneByEmail(email);
      if (!user)
        throw new UserNotFoundError(
          'The user could not be found in the database.',
          404
        );

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UserUnauthorizedError(
          'The user credentials are invalid.',
          401
        );
      }

      const SECRET_KEY = getToken();

      const token = sign(
        {
          userId: user.id,
        },
        SECRET_KEY,
        {
          expiresIn: '2h',
        }
      );

      refreshTokens.push(token);

      const { password: _, ...User } = user;

      const valid = await this.repository.updateToken(email, token);
      if (!valid) {
        throw new UserTokenUpdateError(
          "An unexpexted error ocurred updating the user's current token",
          500
        );
      }

      return { token: token, loggedUser: User };
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async logout(
    email: string,
    auth: string | undefined
  ): Promise<{ token: string | undefined; loggedUser: LoginUser | undefined }> {
    try {
      const user = await this.repository.findOneByEmail(email);
      if (!user)
        throw new UserNotFoundError(
          'The user could not be found in the database.',
          404
        );

      if (!auth)
        throw new UserUnauthorizedError(
          'The user credentials are invalid.',
          401
        );

      const token = auth && auth.split(' ')[1];

      refreshTokens = refreshTokens.filter((t) => t !== token);

      return { token: undefined, loggedUser: undefined };
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }
}
