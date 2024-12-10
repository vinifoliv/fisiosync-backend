import { PrismaClient } from "@prisma/client";
import { UserMusicalGender } from "./UserMusicalGender";

export type UserProps = {
  name: string;
  email: string;
  password: string;
  musicalGenders: Array<number>;
  scale: number;
};

export class User {
  name: string;
  email: string;
  password: string;
  musicalGenders: Array<number>;
  scale: number;

  constructor(user: UserProps) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.musicalGenders = user.musicalGenders;
    this.scale = user.scale;
  }

  async createUser() {
    try {
      const prisma = new PrismaClient();
      if (this.musicalGenders.length === 0)
        throw new Error("Musical genders are required!");

      const user = await prisma.user.create({
        data: {
          name: this.name,
          email: this.email,
          password: this.password,
          scale: {
            connect: { id: this.scale },
          },
        },
      });

      const musicalGenders = this.musicalGenders.map((id) => ({
        userId: user.id,
        genderId: id,
      }));

      for (const gender of musicalGenders) {
        await UserMusicalGender.createUserMusicalGender(gender);
      }

      return user;
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }

  static async getUsers() {
    try {
      const prisma = new PrismaClient();

      return await prisma.user.findMany();
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const prisma = new PrismaClient();
      return await prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }

  static async getUserById(id: number) {
    try {
      const prisma = new PrismaClient();
      return await prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }

  static async updateUser(id: number, user: UserProps) {
    try {
      const prisma = new PrismaClient();
      return await prisma.user.update({
        where: {
          id,
        },
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
          scale: {
            connect: { id: user.scale },
          },
        },
      });
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }
}
