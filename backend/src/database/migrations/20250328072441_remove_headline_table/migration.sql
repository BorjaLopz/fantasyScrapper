/*
  Warnings:

  - You are about to drop the column `headlineId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `Headline` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Headline" DROP CONSTRAINT "Headline_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Headline" DROP CONSTRAINT "Headline_userTeamId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "headlineId";

-- DropTable
DROP TABLE "Headline";
