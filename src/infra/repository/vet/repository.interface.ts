import { Vet } from '../../entities';

export interface IVetRepository {
  findAll(): Promise<Vet[] | undefined>;
  findOneByID(id: string): Promise<Vet | undefined>;
  existsVetID(id: string): Promise<Boolean>;
  save(vet: Vet): Promise<Vet | undefined>;
  update(id: string, Vet: Vet): Promise<Vet>;
  delete(id: string): Promise<Vet>;
}
