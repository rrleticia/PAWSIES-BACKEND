import { Pet } from '../../entities';

export interface IPetRepository {
  findAll(): Promise<Pet[] | undefined>;
  findAllByOwnerID(ownerID: string): Promise<Pet[] | undefined>;
  findOneByID(id: string): Promise<Pet | undefined>;
  save(Pet: Pet): Promise<Pet>;
  update(id: string, Pet: Pet): Promise<Pet>;
  delete(id: string): Promise<Pet>;
  findOneByOwnerWithNameAndType(
    ownerID: string,
    name: string,
    type: string
  ): Promise<Pet | undefined>;
}
