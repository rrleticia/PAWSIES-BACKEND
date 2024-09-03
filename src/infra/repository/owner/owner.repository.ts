import { PrismaClient } from '@prisma/client';
import { IOwnerRepository } from '.';
import { Owner } from '../../entities';

export class PrismaOwnerRepository implements IOwnerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Owner[] | undefined> {
    const owners = await this.prisma.owner.findMany({});
    if (!owners) return undefined;

    const parseOwners = owners.map((owner) => {
      return new Owner(owner.id, owner.name);
    });
    return parseOwners;
  }

  public async findOneByID(id: string): Promise<Owner | undefined> {
    const owner = await this.prisma.owner.findUnique({
      where: {
        id: id,
      },
    });

    if (!owner) return undefined;

    const parseOwner = new Owner(owner.id, owner.name);

    return parseOwner;
  }

  public async save(owner: Owner): Promise<Owner> {
    const createdOwner = await this.prisma.owner.create({
      data: {
        name: owner.name,
      },
    });

    const parseOwner = new Owner(createdOwner.id, createdOwner.name);

    return parseOwner;
  }

  public async update(id: string, owner: Owner): Promise<Owner> {
    const updatedOwner = await this.prisma.owner.update({
      where: {
        id: id,
      },
      data: {
        name: owner.name,
      },
    });

    const parseOwner = new Owner(updatedOwner.id, updatedOwner.name);

    return parseOwner;
  }

  public async delete(id: string): Promise<Owner> {
    const owner = await this.prisma.owner.delete({
      where: {
        id: id,
      },
    });

    const parseOwner = new Owner(owner.id, owner.name);

    return parseOwner;
  }

  public async findOneByName(name: string): Promise<Owner | undefined> {
    const owner = await this.prisma.owner.findUnique({
      where: {
        name: name,
      },
    });

    if (!owner) return undefined;

    const parseOwner = new Owner(owner.id, owner.name);
    return parseOwner;
  }
}
