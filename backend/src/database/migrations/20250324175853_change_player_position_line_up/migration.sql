/*
  Warnings:

  - You are about to drop the column `bottom` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `right` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "bottom",
DROP COLUMN "right",
ADD COLUMN     "positionName" TEXT NOT NULL DEFAULT '';
