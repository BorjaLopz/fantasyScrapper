/*
  Warnings:

  - You are about to drop the column `marketPlayersId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `MarketPlayers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_marketPlayersId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "marketPlayersId",
ADD COLUMN     "marketId" INTEGER;

-- DropTable
DROP TABLE "MarketPlayers";

-- CreateTable
CREATE TABLE "Market" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;
