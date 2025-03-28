/*
  Warnings:

  - You are about to drop the column `playerId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fantasyPlayerId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fantasyTeamId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fantasyPlayerId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fantasyTeamId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Player_playerId_key";

-- DropIndex
DROP INDEX "Team_teamId_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "playerId",
ADD COLUMN     "fantasyPlayerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "teamId",
ADD COLUMN     "fantasyTeamId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_fantasyPlayerId_key" ON "Player"("fantasyPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_fantasyTeamId_key" ON "Team"("fantasyTeamId");
