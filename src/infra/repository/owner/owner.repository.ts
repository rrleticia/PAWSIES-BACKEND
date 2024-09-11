import { PrismaClient } from '@prisma/client';
import { IOwnerRepository } from '.';
import { Owner } from '../../entities';
import { getRoleEnum } from '../../../shared';

export class PrismaOwnerRepository implements IOwnerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Owner[] | undefined> {
    const owners = await this.prisma.user.findMany({
      where: {
        ownerID: {
          not: null,
        },
      },
    });

    if (!owners) return undefined;

    const parseOwners = owners.map((owner) => {
      let parseOwner = new Owner(
        owner.id,
        owner.name,
        owner.role,
        owner.username,
        owner.email,
        owner.password,
        owner.ownerID
      );
      delete parseOwner.password;
      return parseOwner;
    });
    return parseOwners;
  }

  public async findOneByID(id: string): Promise<Owner | undefined> {
    const owner = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!owner) return undefined;

    const parseOwner = new Owner(
      owner.id,
      owner.name,
      owner.role,
      owner.username,
      owner.email,
      owner.password,
      owner.ownerID
    );
    delete parseOwner.password;
    return parseOwner;
  }

  public async save(owner: Owner): Promise<Owner | undefined> {
    if (!owner.password) return undefined;

    const createdOwner = await this.prisma.user.create({
      data: {
        name: owner.name,
        role: getRoleEnum('OWNER'),
        username: owner.username,
        email: owner.email,
        password: owner.password,
        owner: { create: {} },
      },
      include: { owner: true },
    });

    if (!createdOwner) return undefined;

    const parseOwner = new Owner(
      createdOwner.id,
      createdOwner.name,
      createdOwner.role,
      createdOwner.username,
      createdOwner.email,
      createdOwner.password,
      createdOwner.ownerID
    );
    delete parseOwner.password;
    return parseOwner;
  }

  public async update(id: string, owner: Owner): Promise<Owner> {
    const updatedOwner = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: owner.name,
        username: owner.username,
        email: owner.email,
        password: owner.password,
        owner: { create: {} },
      },
      include: { owner: true },
    });

    const parseOwner = new Owner(
      updatedOwner.id,
      updatedOwner.name,
      updatedOwner.role,
      updatedOwner.username,
      updatedOwner.email,
      updatedOwner.password,
      updatedOwner.ownerID
    );
    delete parseOwner.password;
    return parseOwner;
  }

  public async delete(id: string): Promise<Owner> {
    const owner = await this.prisma.user.delete({
      where: {
        id: id,
      },
      include: { owner: true },
    });

    const parseOwner = new Owner(
      owner.id,
      owner.name,
      owner.role,
      owner.username,
      owner.email,
      owner.password,
      owner.ownerID
    );
    delete parseOwner.password;
    return parseOwner;
  }
}
