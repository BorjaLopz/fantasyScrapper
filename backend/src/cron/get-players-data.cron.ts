import { logger } from '@/config/pino';
import prisma from '@/config/prisma';
import { TPlayerData, TPlayerListData } from '@/types/player.type';
import { TStatData } from '@/types/stat.type';
import { Prisma } from '@prisma/client';
import { schedule } from 'node-cron';
import https from 'node:https';

export const getPlayersData = () => {
  logger.info("Getting players data")
  // Fetch players data
  fetchPlayers()
  // Register scheduler
  // schedule('*/30 * * * FRI,SUN,SAT', () => fetchPlayers());
};

const fetchPlayers = () => {
  https
    .get(
      'https://api-fantasy.llt-services.com/api/v4/players?x-lang=es',
      (res) => {
        let data: any = [];
        const headerDate =
          res.headers && res.headers.date
            ? res.headers.date
            : 'no response date';
        console.log('Status Code:', res.statusCode);
        console.log('Date in Response header:', headerDate);

        res.on('data', (chunk) => {
          data.push(chunk);
        });

        res.on('end', async () => {
          const players = JSON.parse(Buffer.concat(data).toString()) as TPlayerListData[]
          for await (const pl of players) {
            const playerResponse = await fetch(`https://api-fantasy.llt-services.com/api/v3/player/${pl.id}?x-lang=es`);

            const player = await playerResponse.json() as TPlayerData;
            const playerCreated = await prisma.player.upsert({
              create: {
                averagePoints: player.averagePoints,
                lastSeasonPoints: player.lastSeasonPoints || 0,
                marketValue: player.marketValue,
                name: player.name,
                nickname: player.nickname,
                fantasyPlayerId: player.id,
                playerStatus: player.playerStatus,
                points: player.points,
                position: player.position,
                positionId: player.positionId,
                slug: player.slug,
                weekPoints: player.weekPoints || 0,
                image: player.images.transparent['256x256'],
                team: {
                  connectOrCreate: {
                    create: {
                      fantasyTeamId: player.team.id,
                      name: player.team.name,
                      shortName: player.team.shortName,
                      slug: player.team.slug,
                      dspId: player.team.dspId,
                      badgeColor: player.team.badgeColor,
                      badgeGray: player.team.badgeGray,
                      badgeWhite: player.team.badgeWhite
                    },
                    where: {
                      fantasyTeamId: player.team.id
                    }
                  }
                }
              },
              update: {
                averagePoints: player.averagePoints,
                lastSeasonPoints: player.lastSeasonPoints || 0,
                marketValue: player.marketValue,
                name: player.name,
                nickname: player.nickname,
                fantasyPlayerId: player.id,
                playerStatus: player.playerStatus,
                points: player.points,
                position: player.position,
                positionId: player.positionId,
                slug: player.slug,
                weekPoints: player.weekPoints || 0,
                image: player.images.transparent['256x256'],
                team: {
                  connectOrCreate: {
                    create: {
                      fantasyTeamId: player.team.id,
                      name: player.team.name,
                      shortName: player.team.shortName,
                      slug: player.team.slug,
                      dspId: player.team.dspId,
                      badgeColor: player.team.badgeColor,
                      badgeGray: player.team.badgeGray,
                      badgeWhite: player.team.badgeWhite
                    },
                    where: {
                      fantasyTeamId: player.team.id
                    }
                  }
                }
              },
              where: { name: player.name }
            })

            const stats: {
              id: number;
              playerId: number | null;
              stats: Prisma.JsonValue;
              weekNumber: number;
              totalPoints: number;
              isInIdealFormation: boolean;
            }[] = []
            for await (const stat of player.playerStats) {
              const statCreated = await prisma.stat.create({
                data: {
                  totalPoints: stat.totalPoints,
                  weekNumber: stat.weekNumber,
                  isInIdealFormation: stat.isInIdealFormation,
                  stats: stat.stats,
                  playerId: playerCreated.id
                }
              })

              stats.push(statCreated)
            }
          }
        });

        logger.info("PLAYERS DATA INSERTED")
      },
    )
    .on('error', (err) => {
      console.log('Error: ', err.message);
    });
};
