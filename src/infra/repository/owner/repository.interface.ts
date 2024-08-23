import { Owner } from '../../entities';

export interface IOwnerRepository {
  findAll(): Promise<Owner[] | undefined>;
  findOneByID(id: string): Promise<Owner | undefined>;
  save(owner: Owner): Promise<Owner>;
  update(id: string, Owner: Owner): Promise<Owner>;
  delete(id: string): Promise<Owner>;
  findOneByEmailAndUsername(
    email: string,
    username: string
  ): Promise<Owner | undefined>;
}
