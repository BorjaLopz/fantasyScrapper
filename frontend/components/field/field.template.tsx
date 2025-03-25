import { Player } from "@/types/player.type"
import App from "./app"
import "./index.css"

type Props = {
  players: Player[]
}

export default function SquadBuilder({ players }: Props) {
  return (
    <div className="flex w-full h-full">
      <App players={players} />
    </div>
  )
}