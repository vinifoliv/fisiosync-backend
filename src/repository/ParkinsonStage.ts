import { PrismaClient } from "@prisma/client";

export type ParkinsonStageProps = {
  id: number;
  range: number[];
};

export class ParkinsonStage {
  id: number;
  range: number[];

  constructor(id: number, range: number[]) {
    this.id = id;
    this.range = range;
  }

  async createStage() {
    const prisma = new PrismaClient();

    return await prisma.parkinsonStage.create({
      data: {
        id: this.id,
        range: this.range,
      },
    });
  }

  static async getParkinsonStages() {
    try {
      const prisma = new PrismaClient();

      return await prisma.parkinsonStage.findMany();
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }

  static async getParkinsonStageRangeById(id: number) {
    try {
      const prisma = new PrismaClient();
      const stage = await prisma.parkinsonStage.findUnique({
        where: {
          id,
        },
      });
      return stage?.range;
    } catch (error) {
      throw new Error("Error on Prisma: " + error);
    }
  }
}
