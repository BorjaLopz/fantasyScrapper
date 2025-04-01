import { Icon } from "@/components/ui/icon";
import { Player } from "@/types/player.type";
import { Plus } from "lucide-react-native";
import React from "react";

type Props = {
  playerOnPosition: Player | undefined;
};

export default function PositionOnPitch({
  playerOnPosition,
}: Props) {

  const getWeekPointsColor = (weekPoints: number) => {
    switch (Math.sign(weekPoints)) {
      case 1:
        return "bg-success";
      case -1:
        return "bg-error";
      default:
        return "bg-warning";
    }
  }

  if (playerOnPosition === undefined) {
    // If player hasn't added to the position yet
    return (
      <Icon
        size="md"
        as={Plus}
        className="text-2xl xl:text-4xl text-white absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-12"
      />
    );
  }

  return (
    <div className="relative w-20 h-24 rounded-lg shadow overflow-hidden bg-base-100">
      {/* Imagen del jugador */}
      {playerOnPosition.image && (
        <img
          src={playerOnPosition.image}
          className="absolute size-[5em] w-full !p-0 z-10"
          alt="image"
        />
      )}

      {/* Número del jugador */}
      {playerOnPosition.weekPoints && (
        <div className={`absolute -top-9 -left-1 rotate-45 text-white font-bold text-lg rounded-lg w-8 h-full flex items-center justify-center ${getWeekPointsColor(Number(playerOnPosition.weekPoints))}`}>
          <span className="-rotate-[45deg]">
            {playerOnPosition.weekPoints}
          </span>
        </div>
      )}

      {/* Logo del patrocinador (opcional) */}
      {playerOnPosition.team.badgeColor && (
        <img
          src={playerOnPosition.team.badgeColor}
          alt="Sponsor"
          className="absolute bottom-18 -right-2 w-8 h-8 rounded-full"
        />
      )}

      {/* Nombre del jugador */}
      <div className="absolute bottom-0 left-0 w-full bg-base-content p-1 z-20">
        <p className="text-sm font-semibold text-center truncate text-neutral w-full">
          {playerOnPosition.nickname}
        </p>
      </div>

      {/* Checkmark (opcional) */}
      {/* <div className="absolute bottom-2 left-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div> */}
    </div>
  );
}
