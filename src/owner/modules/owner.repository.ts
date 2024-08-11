import { PrismaClient } from '@prisma/client';
import { OwnerRepository } from '../interface/index';
import { Owner } from '../models/index';

export class PrismaOwnerRepository implements OwnerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Owner[]> {
    return this.prisma.owner.findMany({});
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
      owner.username
    );

    return parseOwner;
  }

  public async save(owner: Owner): Promise<Owner> {
    return await this.prisma.owner.create({
      data: {
        email: owner.email,
        username: owner.username,
        name: owner.name,
      },
    });
  }

  public async update(id: string, owner: Owner): Promise<Owner> {
    return await this.prisma.owner.update({
      where: {
        id: id,
      },
      data: {
        email: owner.email,
        username: owner.username,
        name: owner.name,
      },
    });
  }

  public async delete(id: string): Promise<Owner> {
    return await this.prisma.owner.delete({
      where: {
        id: id,
      },
    });
  }

  public async findOneByEmailAndUsername(
    email: string,
    username: string
  ): Promise<Owner | undefined> {
    const owner = await this.prisma.owner.findUnique({
      where: {
        email,
        username,
      },
    });

    if (!owner) return undefined;

    const parseOwner = new Owner(
      owner.id,
      owner.name,
      owner.email,
      owner.username
    );

    return parseOwner;
  }
}
