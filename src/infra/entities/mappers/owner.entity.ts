import { Role, User as PrismaOwner } from '@prisma/client';

export class Owner {
  public readonly id: string;
  public readonly name: string;
  public readonly role: Role;
  public readonly username: string;
  public readonly email: string;
  public password?: string;
  public readonly ownerID?: string | null;
  public readonly createdAt?: Date | null;
  public readonly updatedAt?: Date | null;

  constructor(
    id: string,
    name: string,
    role: Role,
    username: string,
    email: string,
    password: string,
    ownerID: string | null,
    createdAt: Date | null,
    updatedAt: Date | null
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.role = role;
    this.email = email;
    this.password = password;
    this.ownerID = ownerID;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static mapFromPrisma(prismaOwner: PrismaOwner): Owner {
    return new Owner(
      prismaOwner.id,
      prismaOwner.name,
      prismaOwner.role,
      prismaOwner.username,
      prismaOwner.email,
      prismaOwner.password,
      prismaOwner.ownerID,
      prismaOwner.createdAt,
      prismaOwner.updatedAt
    );
  }
}
