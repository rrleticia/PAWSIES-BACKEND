import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '.';
import { User } from '../../entities';
import { getRoleEnum } from '../../../shared';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<User[] | undefined> {
    const users = await this.prisma.user.findMany({});

    if (!users) return undefined;

    const parseUsers = users.map((user) => {
      return User.mapFromPrisma(user);
    });
    return parseUsers;
  }

  public async findOneByID(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) return undefined;

    const parseUser = User.mapFromPrisma(user);

    return parseUser;
  }

  public async save(user: User): Promise<User | undefined> {
    if (!user.password) return undefined;

    const createdUser = await this.prisma.user.create({
      data: {
        name: user.role,
        role: getRoleEnum(user.role),
        username: user.username,
        email: user.email,
        password: user.password,
        vetID: user.vetID,
        ownerID: user.ownerID,
      },
    });

    const parseUser = User.mapFromPrisma(createdUser);

    return parseUser;
  }

  public async update(id: string, user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: user.username,
        role: getRoleEnum(user.role),
        email: user.email,
        password: user.password || undefined,
      },
    });

    const parseUser = User.mapFromPrisma(updatedUser);

    return parseUser;
  }

  public async delete(id: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    const parseUser = User.mapFromPrisma(user);

    return parseUser;
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) return undefined;

    const parseUser = User.mapFromPrisma(user);

    return parseUser;
  }

  public async findOneByEmailOrUsername(
    email: string,
    username: string
  ): Promise<User | undefined> {
    const userEmail = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userEmail) {
      const parseUser = User.mapFromPrisma(userEmail);

      return parseUser;
    }

    const userUsername = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userUsername) {
      const parseUser = User.mapFromPrisma(userUsername);
      return parseUser;
    }

    return undefined;
  }
}
