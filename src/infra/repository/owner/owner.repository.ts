import { PrismaClient } from '@prisma/client';
import { IOwnerRepository } from '.';
import { Owner } from '../../entities';

export class PrismaOwnerRepository implements IOwnerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Owner[] | undefined> {
    const owners = await this.prisma.owner.findMany({});
    if (!owners) return undefined;

    const parseOwners = owners.map((owner) => {
      return new Owner(
        owner.id,
        owner.name,
        owner.email,
        owner.username,
        owner.password
      );
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

    const parseOwner = new Owner(
      owner.id,
      owner.name,
      owner.email,
      owner.username,
      owner.password
    );

    return parseOwner;
  }

  public async save(owner: Owner): Promise<Owner> {
    const createdOwner = await this.prisma.owner.create({
      data: {
        email: owner.email,
        username: owner.username,
        name: owner.name,
        password: owner.password,
      },
    });

    const parseOwner = new Owner(
      createdOwner.id,
      createdOwner.name,
      createdOwner.email,
      createdOwner.username,
      createdOwner.password
    );

    return parseOwner;
  }

  public async update(id: string, owner: Owner): Promise<Owner> {
    const updatedOwner = await this.prisma.owner.update({
      where: {
        id: id,
      },
      data: {
        email: owner.email,
        username: owner.username,
        name: owner.name,
      },
    });

    const parseOwner = new Owner(
      updatedOwner.id,
      updatedOwner.name,
      updatedOwner.email,
      updatedOwner.username,
      updatedOwner.password
    );

    return parseOwner;
  }

  public async delete(id: string): Promise<Owner> {
    const owner = await this.prisma.owner.delete({
      where: {
        id: id,
      },
    });

    const parseOwner = new Owner(
      owner.id,
      owner.name,
      owner.email,
      owner.username,
      owner.password
    );

    return parseOwner;
  }

  public async findOneByEmailOrUsername(
    email: string,
    username: string
  ): Promise<Owner | undefined> {
    const ownerEmail = await this.prisma.owner.findUnique({
      where: {
        email: email,
      },
    });

    const ownerUsername = await this.prisma.owner.findUnique({
      where: {
        email: email,
        username: username,
      },
    });

    if (ownerEmail) {
      const parseOwner = new Owner(
        ownerEmail.id,
        ownerEmail.name,
        ownerEmail.email,
        ownerEmail.username,
        ownerEmail.password
      );

      return parseOwner;
    } else if (ownerUsername) {
      const parseOwner = new Owner(
        ownerUsername.id,
        ownerUsername.name,
        ownerUsername.email,
        ownerUsername.username,
        ownerUsername.password
      );

      return parseOwner;
    } else return undefined;
  }
}
