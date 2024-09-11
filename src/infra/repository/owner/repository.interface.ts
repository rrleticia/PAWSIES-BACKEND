import { Owner } from '../../entities';

export interface IOwnerRepository {
  findAll(): Promise<Owner[] | undefined>;
  findOneByID(id: string): Promise<Owner | undefined>;
  save(owner: Owner): Promise<Owner | undefined>;
  update(id: string, Owner: Owner): Promise<Owner>;
  delete(id: string): Promise<Owner>;
}
