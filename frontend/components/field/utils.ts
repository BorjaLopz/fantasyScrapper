import { Player } from "@/types/player.type"

export function isSelected(selectedPlayers: Player[], player: Player) {
  return selectedPlayers.find(selectedPlayer => {
    if (selectedPlayer === undefined) return undefined
    return selectedPlayer.id === player.id
  }) !== undefined
}

export const DISPLAY_NUMBER = "number"
export const DISPLAY_POSITION = "position"
export const DISPLAY_NOTHING = "nothing"