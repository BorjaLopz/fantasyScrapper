-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "headlineId" INTEGER,
ADD COLUMN     "userTeamId" INTEGER;

-- CreateTable
CREATE TABLE "UserTeam" (
    "id" SERIAL NOT NULL,
    "formation" TEXT NOT NULL DEFAULT '4-4-2',
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Headline" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "userTeamId" INTEGER NOT NULL,

    CONSTRAINT "Headline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Headline_playerId_key" ON "Headline"("playerId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userTeamId_fkey" FOREIGN KEY ("userTeamId") REFERENCES "UserTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Headline" ADD CONSTRAINT "Headline_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Headline" ADD CONSTRAINT "Headline_userTeamId_fkey" FOREIGN KEY ("userTeamId") REFERENCES "UserTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
