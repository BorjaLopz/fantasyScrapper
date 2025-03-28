-- CreateTable
CREATE TABLE "UserBank" (
    "id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL DEFAULT 35000000.00,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketBids" (
    "id" SERIAL NOT NULL,
    "bid" DECIMAL(65,30) NOT NULL,
    "playerId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MarketBids_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBank_userId_key" ON "UserBank"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketBids_playerId_key" ON "MarketBids"("playerId");

-- AddForeignKey
ALTER TABLE "UserBank" ADD CONSTRAINT "UserBank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketBids" ADD CONSTRAINT "MarketBids_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketBids" ADD CONSTRAINT "MarketBids_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
