import { Owner } from '../../../models';

export interface IOwnerRepository {
  findAll(): Promise<Owner[]>;
  findOneByID(id: string): Promise<Owner | undefined>;
  save(Owner: Owner): Promise<Owner>;
  update(id: string, Owner: Owner): Promise<Owner>;
  delete(id: string): Promise<Owner>;
  findOneByEmailAndUsername(
    email: string,
    username: string
  ): Promise<Owner | undefined>;
}
