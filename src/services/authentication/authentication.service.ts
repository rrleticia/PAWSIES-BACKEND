import {
  LoginValidationError,
  UserNotFoundError,
  UserPasswordFieldError,
  UserUnauthorizedError,
} from '../../errors';
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
  ): Promise<{ token: string; loggedUser: LoginUser; expiresIn: string }> {
    try {
      const user = await this.repository.findOneByEmail(email);

      if (!user)
        throw new UserNotFoundError(
          'The user could not be found in the database.',
          404
        );

      if (!user.password)
        throw new UserPasswordFieldError(
          'Invalid input for password field of User.',
          405
        );

      console.log(password, user.password);

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UserUnauthorizedError(
          'The user credentials are invalid. There was an error matching the password.',
          401
        );
      }

      const SECRET_KEY = getToken();

      const expirationDate = '31d';

      const token = sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: expirationDate,
      });

      refreshTokens.push(token);

      const { password: _, ...User } = user;

      return { token: token, loggedUser: User, expiresIn: expirationDate };
    } catch (error) {
      if (error instanceof LoginValidationError) {
        throw error;
      }
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      if (error instanceof UserPasswordFieldError) {
        throw error;
      }
      if (error instanceof UserUnauthorizedError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async logout(
    email: string,
    auth: string | undefined
  ): Promise<{
    token: string | undefined;
    loggedUser: LoginUser | undefined;
    expiresIn: string | undefined;
  }> {
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

      return { token: undefined, loggedUser: undefined, expiresIn: undefined };
    } catch (error) {
      if (error instanceof LoginValidationError) {
        throw error;
      }
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      if (error instanceof UserUnauthorizedError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }
}
