/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scaleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "scaleId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MusicalGender" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MusicalGender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkinsonScale" (
    "id" INTEGER NOT NULL,
    "range" INTEGER[],

    CONSTRAINT "ParkinsonScale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMusicalGender" (
    "userId" INTEGER NOT NULL,
    "genderId" INTEGER NOT NULL,

    CONSTRAINT "UserMusicalGender_pkey" PRIMARY KEY ("userId","genderId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MusicalGender_name_key" ON "MusicalGender"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "ParkinsonScale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMusicalGender" ADD CONSTRAINT "UserMusicalGender_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMusicalGender" ADD CONSTRAINT "UserMusicalGender_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "MusicalGender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
