import { Player } from "@/types/player.type"
import App from "./app"
import "./index.css"

type Props = {
  teamId: number
  players: Player[]
  formation: string
}

export default function SquadBuilder({ players, formation, teamId }: Props) {
  return (
    <div className="flex w-full h-full">
      <App players={players} formation={formation} teamId={teamId} />
    </div>
  )
}