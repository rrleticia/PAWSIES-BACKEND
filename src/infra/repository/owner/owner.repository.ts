import { PrismaClient } from '@prisma/client';
import { IOwnerRepository } from '.';
import { Owner, OwnerRequest } from '../../entities';
import { getRoleEnum } from '../../../shared';

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

  public async save(owner: OwnerRequest): Promise<Owner | undefined> {
    const createdUser = await this.prisma.user.create({
      data: {
        username: owner.username,
        role: getRoleEnum('OWNER'),
        email: owner.email,
        password: owner.password,
        owner: { create: { name: owner.name } },
      },
    });

    let createdOwner;
    if (createdUser.ownerID)
      createdOwner = await this.prisma.owner.findUnique({
        where: {
          id: createdUser.ownerID,
        },
      });
    console.log('aaaaaa');
    if (!createdOwner) return undefined;

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
