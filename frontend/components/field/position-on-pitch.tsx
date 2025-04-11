import { CircleX, Plus, Shirt } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { DISPLAY_NUMBER, DISPLAY_POSITION } from "./utils";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Image } from "../ui/image";
import { Player } from "@/types/player.type";

type Props = {
  playerOnPosition: Player | undefined;
};

export default function PositionOnPitch({
  playerOnPosition,
}: Props) {
  if (playerOnPosition === undefined) {
    // If player hasn't added to the position yet
    return (
      <>
        <Icon
          size="md"
          as={Plus}
          className="text-2xl xl:text-4xl text-white absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-12"
        />
        {/* {selectedPlayerFromBench === null ? ( // Selected Player is not null when user want to add a player from the bench to the squad
          <>
            <Icon as={Shirt} className="text-6xl xl:text-7xl text-black absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <span
              className="player-name bg-purple-100 text-purple-800 text-xs xl:text-base xl:leading-5 leading-4 font-medium me-2 px-2.5 py-0.5 dark:bg-purple-900 dark:text-purple-300 
                      absolute z-10 top-[52px] xl:top-[62px] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              dangerouslySetInnerHTML={{ __html: "asdfas" }}
            ></span>
          </>
        ) : (
          <Icon
            as={Shirt}
            className="text-6xl xl:text-7xl text-blue-600 absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        )} */}
      </>
    );
  }

  return (
    <div className="relative w-20 h-24 rounded-lg shadow overflow-hidden">
      {/* Imagen del jugador */}
      {playerOnPosition.image && (
        <Image
          source={playerOnPosition.image}
          className="absolute h-[4em] w-full !p-0 z-10"
          alt="image"
        />
      )}

      {/* Número del jugador */}
      {playerOnPosition.weekPoints && (
        <div className="absolute -top-9 -left-1 rotate-45 bg-green-500 text-white font-bold text-lg rounded-lg w-8 h-full flex items-center justify-center">
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
      <div className="absolute bottom-0 left-0 w-full bg-white p-1 z-20">
        <p className="text-sm font-semibold text-center truncate text-typography-950 w-full">
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
