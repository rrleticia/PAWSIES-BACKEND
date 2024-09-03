import { Request, Response } from 'express';
import { AuthenticationService } from '../../services';

export class AuthenticationController {
  constructor(private readonly service: AuthenticationService) {}

  public async login(request: Request, response: Response): Promise<Response> {
    const email = request.params.email;
    const password = request.params.password;
    const result = await this.service.login(email, password);
    return response.status(200).json(result);
  }

  public async logout(request: Request, response: Response): Promise<Response> {
    const email = request.params.email;
    const auth = request.headers['authorization'];
    const result = await this.service.logout(email, auth);
    return response.status(200).json(result);
  }
}
