import { Fragment } from "react";
import PositionOnPitch from "./position-on-pitch";
import CustomSelect from "./custom-select";
import { Player } from "@/types/player.type";

export function renderPositions(
  playerPositions: any[],
  selectedPlayers: Player[],
  screenWidth: any,
  handlePositionClick: any
) {
  const usedPlayers: Player[] = [];
  return playerPositions.map((position: any, index: number) => {
    // mapping throught the positions
    const positionType = position.positionType; // Getting the type of the position (attacker/midfielder/defender/goalkeeper)
    const playerOnPosition = selectedPlayers.find((player: Player) => {
      if (
        player.positionName == position.positionName &&
        !usedPlayers.includes(player)
      ) {
        usedPlayers.push(player);

        return player;
      }
    }); // Getting the player that has been added to this position(if not yet it's undefined)

    return (
      <Fragment key={index}>
        <div
          key={index}
          className="absolute cursor-pointer"
          style={{
            top: `${screenWidth <= 1280
              ? position.top["mobile"] - 10
              : position.top["desktop"]
              }%`,
            right: `${screenWidth <= 1280
              ? position.right["mobile"] - 10
              : position.right["desktop"]
              }%`,
          }}
          onClick={() => {
            handlePositionClick(
              positionType,
              playerOnPosition?.positionName,
              playerOnPosition
            );
          }}
        >
          <PositionOnPitch
            playerOnPosition={playerOnPosition}
          />
        </div>
      </Fragment>
    );
  });
}

export function renderFormationSelector(
  currentFormation: string,
  handleFormationChange: any,
  formationsData: any
) {
  // rendering the formation selector when user can change the current formation
  return (
    <CustomSelect
      currentFormation={currentFormation}
      formationsData={formationsData}
      handleFormationChange={handleFormationChange}
    />
  );
}
