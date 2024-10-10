import { AppointmentService } from '../../services';
import { Request, Response } from 'express';
import { parseBoolean } from '../../shared';

export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  public async getAll(request: Request, response: Response): Promise<Response> {
    const result = await this.service.getAll();
    return response.status(200).json(result);
  }

  public async getAllByPetID(
    request: Request,
    response: Response
  ): Promise<Response> {
    const petID = request.params.petID;
    const result = await this.service.getAllByPetID(petID);
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
    const appontiment = request.body;
    const result = await this.service.create(appontiment);
    return response.status(201).json(result);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const appontiment = request.body;
    const result = await this.service.update(appontiment);
    return response.status(201).json(result);
  }

  public async updateStatus(
    request: Request,
    response: Response
  ): Promise<Response> {
    const id = request.params.id;
    const status = request.params.status;
    const result = await this.service.updateStatus(id, status);
    return response.status(201).json(result);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id = request.params.id;
    const result = await this.service.delete(id);
    return response.status(200).json(result);
  }
}
