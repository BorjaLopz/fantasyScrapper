import { TStatData } from "./stat.type"
import { TTeamData } from "./team.type"

export type TPlayerListData = {
  id: number,
  images: TPlayerImageData,
  positionId: number,
  nickname: string,
  lastSeasonPoints: number,
  playerStatus: string,
  team: TTeamData,
  points: number,
  averagePoints: number,
  weekPoints: TPlayerWeekPointData[]
}

export type TPlayerImageData = {
  big: {
    "2048x2225": string,
    "1024x1113": string,
    "512x556": string,
    "256x278": string,
    "128x139": string,
    "64x70": string
  },
  beat: {
    "2048x2048": string,
    "1024x1024": string,
    "512x512": string,
    "256x256": string,
    "128x128": string,
    "64x64": string
  },
  transparent: {
    "2048x2048": string,
    "1024x1024": string,
    "512x512": string,
    "256x256": string,
    "128x128": string,
    "64x64": string
  }
}

export type TPlayerWeekPointData = {
  weekNumber: number,
  points: number
}

export type TPlayerData = {
  id: string,
  name: string,
  nickname: string,
  points: number,
  weekPoints: number,
  averagePoints: number,
  lastSeasonPoints: number,
  slug: string,
  positionId: number,
  position: string,
  marketValue: number,
  playerStatus: string,
  team: TTeamData,
  images: TPlayerImageData,
  playerStats: TStatData[]
}