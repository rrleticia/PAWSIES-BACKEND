import { Role, User as PrismaUser } from '@prisma/client';

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly role: Role;
  public readonly username: string;
  public readonly email: string;
  public password?: string;
  public readonly vetID: string | null;
  public readonly ownerID: string | null;
  public readonly createdAt?: Date | null;
  public readonly updatedAt?: Date | null;

  constructor(
    id: string,
    name: string,
    role: Role,
    username: string,
    email: string,
    password: string,
    vetID: string | null,
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
    this.vetID = vetID;
    this.ownerID = ownerID;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static mapFromPrisma(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.role,
      prismaUser.username,
      prismaUser.email,
      prismaUser.password,
      prismaUser.vetID,
      prismaUser.ownerID,
      prismaUser.createdAt,
      prismaUser.updatedAt
    );
  }
}
