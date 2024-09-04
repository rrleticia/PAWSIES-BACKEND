import { Vet, VetRequest } from '../../entities';

export interface IVetRepository {
  findAll(): Promise<Vet[] | undefined>;
  findOneByID(id: string): Promise<Vet | undefined>;
  save(vet: VetRequest): Promise<Vet | undefined>;
  update(id: string, Vet: Vet): Promise<Vet>;
  delete(id: string): Promise<Vet>;
  findOneByName(name: string): Promise<Vet | undefined>;
}
