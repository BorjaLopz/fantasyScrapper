import { logger } from '@/config/pino';
import prisma from '@/config/prisma';
import axios from 'axios';
import { load } from 'cheerio';

export const getMatchesData = () => {
  logger.info("Getting matches data")
  // Fetch players data
  fetchMatches()
  // Register scheduler
  // schedule('*/30 * * * FRI,SUN,SAT', () => fetchPlayers());
};

const fetchMatches = async () => {
  try {
    const html = await fetchHTML("https://fbref.com/es/comps/12/horario/Resultados-y-partidos-en-La-Liga");
    const $ = load(html);

    const trs = $("tr")
    trs.map(async (i, el) => {
      const el2 = $(el)
      if (el2.find("[data-stat='gameweek']").text() !== "" && i > 0) {
        await prisma.match.deleteMany()
        await prisma.match.create({
          data: {
            gameWeek: Number(el2.find("[data-stat='gameweek']").text()),
            date: new Date(el2.find("[data-stat='date']").text()),
            startTime: el2.find("[data-stat='start_time']").text(),
            homeTeam: el2.find("[data-stat='home_team']").text(),
            score: el2.find("[data-stat='score']").text(),
            awayTeam: el2.find("[data-stat='away_team']").text(),
            notes: el2.find("[data-stat='notes']").text(),
          },
        })
      }
    })
  } catch (err) {
    logger.error("ERROR", err)
  }
};

async function fetchHTML(url: string) {
  try {
    const { data } = await axios.get(url);

    return data;
  } catch (error) {
    console.error(`Error fetching the HTML: ${error}`);
  }
}
