import { Owner } from '../models';

export interface OwnerRepository {
  findAll(): Promise<Owner[]>;
  findOneByID(id: string): Promise<Owner | undefined>;
  save(Owner: Owner): Promise<Owner>;
  update(id: string, Owner: Owner): Promise<Owner>;
  delete(id: string): Promise<Owner>;
  // findByEmail(email: string): Promise<Owner | undefined>;
}
