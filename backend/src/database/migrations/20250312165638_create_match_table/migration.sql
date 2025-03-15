-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "gameWeek" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);
