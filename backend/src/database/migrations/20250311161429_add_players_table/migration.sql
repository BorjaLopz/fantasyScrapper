-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "dspId" INTEGER NOT NULL,
    "store" TEXT,
    "badgeColor" TEXT NOT NULL,
    "badgeGray" TEXT NOT NULL,
    "badgeWhite" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "image" TEXT,
    "points" DECIMAL(65,30) NOT NULL,
    "weekPoints" DECIMAL(65,30) NOT NULL,
    "averagePoints" DECIMAL(65,30) NOT NULL,
    "lastSeasonPoints" DECIMAL(65,30) NOT NULL,
    "slug" TEXT NOT NULL,
    "positionId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "marketValue" DECIMAL(65,30) NOT NULL,
    "playerStatus" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" SERIAL NOT NULL,
    "stats" JSONB NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "isInIdealFormation" BOOLEAN NOT NULL DEFAULT false,
    "playerId" INTEGER,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamId_key" ON "Team"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_playerId_key" ON "Player"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
