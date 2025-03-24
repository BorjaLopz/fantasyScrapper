import { Player } from "@/types/player.type"
import App from "./app"
import "./index.css"

type Props = {
  players: Player[]
}

export default function SquadBuilder({ players }: Props) {
  return (
    <div className="squad-builder-tailwind">
      <App players={players} />
    </div>
  )
}