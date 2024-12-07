/*
  Warnings:

  - You are about to drop the `ParkinsonScale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_scaleId_fkey";

-- DropTable
DROP TABLE "ParkinsonScale";

-- CreateTable
CREATE TABLE "ParkinsonStage" (
    "id" INTEGER NOT NULL,
    "range" INTEGER[],

    CONSTRAINT "ParkinsonStage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "ParkinsonStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
