import { PrismaClient } from "@prisma/client";

export class MusicalGender {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async createMusicalGender() {
    const prisma = new PrismaClient();

    try {
      const result = await prisma.musicalGender.create({
        data: {
          name: this.name,
        },
      });

      return result;
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }

  static async getMusicalGenders() {
    const prisma = new PrismaClient();
    return await prisma.musicalGender.findMany();
  }

  static async getMusicalGenderIdsByName(names: Array<string>) {
    try {
      const genders = await this.getMusicalGenders();
      const ids = [];
      for (const gender of genders) {
        if (names.includes(gender.name)) ids.push(gender.id);
      }
      return ids;
    } catch (error) {
      const fError = error as Error;
      throw new Error("Error on Prisma: " + fError.message);
    }
  }
}
