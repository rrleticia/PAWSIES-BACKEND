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
      return new User(
        user.id,
        user.name,
        user.role,
        user.username,
        user.email,
        user.password,
        user.vetID,
        user.ownerID
      );
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

    const parseUser = new User(
      user.id,
      user.name,
      user.role,
      user.username,
      user.email,
      user.password,
      user.vetID,
      user.ownerID
    );

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

    const parseUser = new User(
      createdUser.id,
      createdUser.name,
      createdUser.role,
      createdUser.username,
      createdUser.email,
      createdUser.password,
      createdUser.vetID,
      createdUser.ownerID
    );

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
        password: user.password,
      },
    });

    const parseUser = new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.role,
      updatedUser.username,
      updatedUser.email,
      updatedUser.password,
      updatedUser.vetID,
      updatedUser.ownerID
    );

    return parseUser;
  }

  public async delete(id: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    const parseUser = new User(
      user.id,
      user.name,
      user.role,
      user.username,
      user.email,
      user.password,
      user.vetID,
      user.ownerID
    );

    return parseUser;
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) return undefined;

    const parseUser = new User(
      user.id,
      user.name,
      user.role,
      user.username,
      user.email,
      user.password,
      user.vetID,
      user.ownerID
    );

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

    const userUsername = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userEmail) {
      const parseUser = new User(
        userEmail.id,
        userEmail.name,
        userEmail.role,
        userEmail.username,
        userEmail.email,
        userEmail.password,
        userEmail.vetID,
        userEmail.ownerID
      );

      return parseUser;
    } else if (userUsername) {
      const parseUser = new User(
        userUsername.id,
        userUsername.name,
        userUsername.role,
        userUsername.username,
        userUsername.email,
        userUsername.password,
        userUsername.vetID,
        userUsername.ownerID
      );

      return parseUser;
    } else return undefined;
  }
}
