import { Owner, OwnerRequest } from '../../entities';

export interface IOwnerRepository {
  findAll(): Promise<Owner[] | undefined>;
  findOneByID(id: string): Promise<Owner | undefined>;
  save(owner: OwnerRequest): Promise<Owner | undefined>;
  update(id: string, Owner: Owner): Promise<Owner>;
  delete(id: string): Promise<Owner>;
  findOneByName(name: string): Promise<Owner | undefined>;
}
