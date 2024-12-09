import { PrismaClient } from "@prisma/client";

export type UserMusicalGenderProps = {
  userId: number;
  genderId: number;
};

export class UserMusicalGender {
  userId: number;
  genderId: number;

  constructor(userMusicalGender: UserMusicalGenderProps) {
    this.userId = userMusicalGender.userId;
    this.genderId = userMusicalGender.genderId;
  }

  static async createUserMusicalGender(userMusicalGender: UserMusicalGenderProps) {
    try {
      const prisma = new PrismaClient();
      return await prisma.userMusicalGender.create({ data: userMusicalGender });
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }

  static async getAllUserMusicalGenders() {
    try {
      const prisma = new PrismaClient();
      return await prisma.userMusicalGender.findMany();
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }

  static async getUserMusicalGenders(userId: number) {
    try {
      const prisma = new PrismaClient();
      const genders = await prisma.userMusicalGender.findMany({
        where: {
          userId,
        },
      });

      return genders;
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }
}
