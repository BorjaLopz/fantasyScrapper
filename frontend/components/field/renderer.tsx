import { Player } from "@/types/player.type";
import { Fragment, useState, useEffect } from "react";
import PositionOnPitch from "./position-on-pitch";

export function renderPositions(
  playerPositions: any[],
  selectedPlayers: Player[],
  screenWidth: any,
  handlePositionClick: (positionType: string, position: string, player: Player) => void) {
  const usedPlayers: Player[] = [];

  return playerPositions?.map((position: any, index: number) => {
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

    // if (!playerOnPosition) {
    //   return (
    //     <div
    //       key={index}
    //       className="absolute cursor-pointer"
    //       style={{
    //         top: `${screenWidth <= 1280
    //           ? position.top["mobile"] - 10
    //           : position.top["desktop"]
    //           }%`,
    //         right: `${screenWidth <= 1280
    //           ? position.right["mobile"] - 10
    //           : position.right["desktop"]
    //           }%`,
    //       }}
    //       onClick={() => {
    //         handlePositionClick(
    //           positionType,
    //           "",
    //           playerOnPosition!
    //         );
    //       }}
    //     >
    //       <PositionOnPitch playerOnPosition={playerOnPosition} />
    //     </div>
    //   );
    // }

    return (
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
            playerOnPosition?.positionName!,
            playerOnPosition!
          );
        }}
      >
        <PositionOnPitch playerOnPosition={playerOnPosition} />
      </div>
    );
  });
}

export function renderFormationSelector(
  currentFormation: string,
  handleFormationChange: any,
  formationsData: any
) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(currentFormation);

  const handleElementClick = (e: any) => {
    const newFormation = e.target.textContent;
    handleFormationChange(newFormation);
    setSelectedFormation(newFormation);
    setIsOpen(false);
  };

  let formationsGrouped: any = {};
  formationsData.map((formation: any) => {
    if (formation[0] in formationsGrouped) {
      formationsGrouped[formation[0]].push(formation);
    } else {
      formationsGrouped[formation[0]] = [formation];
    }
  });

  useEffect(() => {
    if (null == selectedFormation) {
      setSelectedFormation(currentFormation); // When formationData arrives we set the current formation to that
    }
  }, [formationsData]); // When formationData changes

  // rendering the formation selector when user can change the current formation
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-sm btn-primary m-1" onClick={() => setIsOpen(!isOpen)}>{currentFormation}</div>
      {isOpen && (
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[30] w-full p-2 shadow">
          {Object.keys(formationsGrouped).map((key, index) => (
            <li key={index}>
              <a>
                <div>
                  <h4 className="text-left text-lg mb-1">{key} ABT</h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-2 mx-2">
                    {formationsGrouped[key].map((formation: any, index: number) => (
                      <div
                        onClick={handleElementClick}
                        key={index}
                        className={`btn btn-sm ${selectedFormation == formation
                          ? "bg-primary text-typography-0"
                          : "bg-secondary"
                          } w-full`}
                      >
                        {formation}
                      </div>
                    ))}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
