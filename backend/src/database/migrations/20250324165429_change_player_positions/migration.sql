/*
  Warnings:

  - The `bottom` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `right` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "bottom",
ADD COLUMN     "bottom" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "right",
ADD COLUMN     "right" INTEGER NOT NULL DEFAULT 0;
