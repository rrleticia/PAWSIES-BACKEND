import { Request, Response } from 'express';
import { PetService } from '../../services';

export class PetController {
  constructor(private readonly service: PetService) {}

  public async getAll(request: Request, response: Response): Promise<Response> {
    const result = await this.service.getAll();
    return response.status(200).json(result);
  }

  public async getAllByOwnerUsername(
    request: Request,
    response: Response
  ): Promise<Response> {
    const username = request.params.username;
    const result = await this.service.getAllByOwnerUsername(username);
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
    const pet = request.body;
    const result = await this.service.create(pet);
    return response.status(201).json(result);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const pet = request.body;
    const result = await this.service.update(pet);
    return response.status(201).json(result);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id = request.params.id;
    const result = await this.service.delete(id);
    return response.status(200).json(result);
  }
}
