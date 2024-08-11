import { Request, Response } from 'express';
import { Owner } from '../models';
import { OwnerService } from './owner.service';
import { OwnerAlreadyExistsError, OwnerNotFoundError } from '../error';

export class OwnerController {
  constructor(private readonly service: OwnerService) {}

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
    const owner = request.body.owner;
    const result = await this.service.create(owner);
    return response.status(201).json(result);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const owner = request.body.owner;
    const result = await this.service.update(owner);
    return response.status(201).json(result);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id = request.params.id;
    const result = await this.service.delete(id);
    return response.status(200).json(result);
  }
}
