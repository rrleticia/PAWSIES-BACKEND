import { Request, Response } from 'express';
import { UserService } from '../../services';

export class UserController {
  constructor(private readonly service: UserService) {}

  public async getAll(request: Request, response: Response): Promise<Response> {
    const result = await this.service.getAll();
    return response.status(200).json(result);
  }

  public async getOneByID(
    request: Request,
    response: Response
  ): Promise<Response> {
    const id = request.params.id;
    const result = await this.service.getOneByID(id);
    return response.status(200).json(result);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user = request.body.value;
    const result = await this.service.create(user);
    return response.status(201).json(result);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user = request.body.value;
    const result = await this.service.update(user);
    return response.status(201).json(result);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id = request.params.id;
    const result = await this.service.delete(id);
    return response.status(200).json(result);
  }
}
