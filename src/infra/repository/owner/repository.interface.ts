import { Owner } from '../../entities';

export interface IOwnerRepository {
  findAll(): Promise<Owner[] | undefined>;
  findOneByID(id: string): Promise<Owner | undefined>;
  existsOwnerID(id: string): Promise<Boolean>;
  save(owner: Owner): Promise<Owner | undefined>;
  update(id: string, Owner: Owner): Promise<Owner>;
  delete(id: string): Promise<Owner>;
}
