-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "marketPlayersId" INTEGER;

-- CreateTable
CREATE TABLE "MarketTransactions" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MarketTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPlayers" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "MarketPlayers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_marketPlayersId_fkey" FOREIGN KEY ("marketPlayersId") REFERENCES "MarketPlayers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketTransactions" ADD CONSTRAINT "MarketTransactions_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketTransactions" ADD CONSTRAINT "MarketTransactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
