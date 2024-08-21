import { Request, Response } from 'express';
import { VetService } from '../../services';

export class VetController {
  constructor(private readonly service: VetService) {}

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
    const vet = request.body.value;
    const result = await this.service.create(vet);
    return response.status(201).json(result);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const vet = request.body.value;
    const result = await this.service.update(vet);
    return response.status(201).json(result);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id = request.params.id;
    const result = await this.service.delete(id);
    return response.status(200).json(result);
  }
}
