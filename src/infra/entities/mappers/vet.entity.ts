import {
  Role,
  Specialty,
  User as PrismaVet,
  Vet as PrismaVetInfo,
} from '@prisma/client';

export class Vet {
  public readonly id: string;
  public readonly name: string;
  public readonly specialty: Specialty | null;
  public readonly role: Role;
  public readonly username: string;
  public readonly email: string;
  public password?: string;
  public readonly vetID?: string | null;
  public readonly createdAt?: Date | null;
  public readonly updatedAt?: Date | null;

  constructor(
    id: string,
    name: string,
    specialty: Specialty | null,
    role: Role,
    username: string,
    email: string,
    password: string,
    vetID: string | null,
    createdAt: Date | null,
    updatedAt: Date | null
  ) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.username = username;
    this.email = email;
    this.password = password;
    this.specialty = specialty;
    this.vetID = vetID;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static mapFromPrisma(
    prismaVet: PrismaVet,
    prismaVetInfo: PrismaVetInfo
  ): Vet {
    return new Vet(
      prismaVet.id,
      prismaVet.name,
      prismaVetInfo.specialty,
      prismaVet.role,
      prismaVet.username,
      prismaVet.email,
      prismaVet.password,
      prismaVet.vetID,
      prismaVet.createdAt,
      prismaVet.updatedAt
    );
  }
}
