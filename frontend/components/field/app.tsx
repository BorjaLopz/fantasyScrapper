import {
  updatePlayersPosisition,
  updateTeamFormation,
} from "@/services/my-team.service";
import { Player } from "@/types/player.type";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { availableFormations } from "./formations";
import Pitch from "./pitch";
import PlayerSelectModal from "./player-select.modal";
import { renderFormationSelector, renderPositions } from "./renderer";

type Props = {
  teamId: number;
  players: Player[];
  formation: string;
};

function App({ players, formation, teamId }: Props) {
  const [selectedFormation, setSelectedFormation] = useState(""); // The current selected formation
  const [formationsData, setFormationsData] = useState<any>([]); // The available formations and their data
  const [playerPositions, setPlayerPositions] = useState<
    {
      positionType: string;
      positionName: string;
      top: { mobile: number; desktop: number };
      right: { mobile: number; desktop: number };
    }[]
  >([]); // The positions of the palyers on the pitch (For example which position to render the GK to)
  const [playerSelectModalOpen, setPlayerSelectModalOpen] = useState(false); // Is modal open to pick player (Activate by clicking a position on the starting XI)

  // const [informationModalOpen, setInformationModalOpen] = useState(false); // Storing wheter the modal showing information open or closed (For example it pops up when user tries to add a GK to any other position)
  // const [informationModalType, setInformationModalType] = useState("info"); // Information modal can be info or wrong_position
  // const [informationModalMessage, setInformationModalMessage] = useState(""); // Allowing to set modal's message dynamically (this state stores it)

  const [currentPositionType, setCurrentPositionType] = useState("delantero"); // The position type the user is picking to add (attacker/midfielder/defender/goalkeeper)
  const [availablePlayers, setAvailablePlayers] = useState([...players]); // All of the available players that user can add

  const [selectedPosition, setSelectedPosition] = useState<string | null>(null); // The current position the user is picking (from the modal) which player to add
  const [selectedPlayer, setSelectedPlayer] = useState<Player>({} as Player); // The current position the user is picking (from the modal) which player to add
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>(
    [...players].filter((player) => player.positionName !== "")
  ); // Keeping track of the selected player by the user (a.k.a. members of the starting XI)
  const [playersToUpdate, setPlayersToUpdate] = useState<Player[]>([]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const {
    mutateAsync: mutatePlayers,
    isError: playersError,
    isPending: playersPending,
    isSuccess: playersSuccess,
  } = useMutation({
    mutationFn: async () => updatePlayersPosisition(playersToUpdate),
  });

  const {
    mutateAsync: mutateFormation,
    isError: formationError,
    isPending: formationPending,
    isSuccess: formationSuccess,
  } = useMutation({
    mutationFn: async () => updateTeamFormation(teamId, selectedFormation),
  });

  const updateDimensions = () => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
  };

  const handleFormationChange = (newFormation: string) => {
    setSelectedFormation(newFormation); // Chaning to formation
    const formation: {
      positionType: string;
      positionName: string;
      top: { mobile: number; desktop: number };
      right: { mobile: number; desktop: number };
    }[] = formationsData[newFormation]["positions"];
    setPlayerPositions(formation); // Loading the position data

    const defenders = formation.filter((f) => f.positionType === "defensa");
    const midfielders = formation.filter(
      (f) => f.positionType === "mediocentro"
    );
    const attackers = formation.filter((f) => f.positionType === "delantero");

    const result = [selectedPlayers.find((pl) => pl.positionId === 1)!];
    const selectedDefenders = availablePlayers.filter(
      (pl) => pl.positionId === 2
    );
    selectedDefenders.forEach((pl) => {
      pl.positionName = "";
      pl.positionNameIndex = 0;
    });
    selectedDefenders.slice(0, defenders.length).map((pl, index) => {
      pl.positionName = defenders[index].positionName;
      pl.positionNameIndex = result.length + index;
    });
    result.push(...selectedDefenders);

    const selectedMidfielders = availablePlayers.filter(
      (pl) => pl.positionId === 3
    );
    selectedMidfielders.forEach((pl) => {
      pl.positionName = "";
      pl.positionNameIndex = 0;
    });
    selectedMidfielders.slice(0, midfielders.length).map((pl, index) => {
      pl.positionName = midfielders[index].positionName;
      pl.positionNameIndex = result.length + index;
    });
    result.push(...selectedMidfielders);

    const selectedAttackers = availablePlayers.filter(
      (pl) => pl.positionId === 4
    );
    selectedAttackers.forEach((pl) => {
      pl.positionName = "";
      pl.positionNameIndex = 0;
    });
    selectedAttackers.slice(0, attackers.length).map((pl, index) => {
      pl.positionName = attackers[index].positionName;
      pl.positionNameIndex = result.length + index;
    });
    result.push(...selectedAttackers);

    setSelectedPlayers(result);
    setPlayersToUpdate(result);
    mutatePlayers();
    mutateFormation();
  };

  const addPlayerToPitch = (player: Player) => {
    let oldSelectedPlayers = selectedPlayers;
    const index = oldSelectedPlayers.findIndex(
      (pl) => pl.name.toUpperCase() === selectedPlayer.name.toUpperCase()
    );
    const oldPlayer = oldSelectedPlayers[index];
    if (index !== -1) {
      oldSelectedPlayers[index] = {
        ...player,
        positionName: selectedPosition!,
        positionNameIndex: oldPlayer.positionNameIndex,
      };
    }
    setPlayersToUpdate((old) => [
      ...old,
      { ...oldPlayer, positionName: "", positionNameIndex: 0 },
    ]);
    setPlayersToUpdate((old) => [
      ...old,
      {
        ...player,
        positionName: selectedPosition!,
        positionNameIndex: oldPlayer.positionNameIndex,
      },
    ]);
    setSelectedPlayers(oldSelectedPlayers); // Adding to the starting XI
    mutatePlayers();
  };

  const handlePositionClick = (
    positionType: any,
    position: string,
    player: Player
  ) => {
    // Handle clicking on a player position on the pitch
    setCurrentPositionType(positionType); // Setting the type of the position
    setSelectedPosition(position); // Setting the id(the exact position) to know where to add
    setSelectedPlayer(player); // Setting the id(the exact position) to know where to add
    setPlayerSelectModalOpen(true); // Opening the modal
  };

  useEffect(() => {
    // loading the formations and setting some default values
    try {
      let jsonData: [
        key: string,
        {
          positions: {
            positionType: string;
            positionName: string;
            top: { mobile: number; desktop: number };
            right: { mobile: number; desktop: number };
          }[];
        }
      ][] = Object.entries(availableFormations);
      setFormationsData(availableFormations);
      const fmt = jsonData.find((jd) => jd[0] === formation);
      setPlayerPositions(fmt?.[1].positions!);
      setSelectedFormation(formation);
    } catch (error) {
      console.error("Error loading formations:", error);
    }
    //We need to determine the screen size in order to show the correct pitch on desktop and mobile(mobile one is different)
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="w-full h-full">
      <Pitch
        renderPositions={() =>
          renderPositions(
            playerPositions,
            selectedPlayers,
            screenWidth,
            handlePositionClick
          )
        }
        renderFormationSelector={() =>
          renderFormationSelector(
            selectedFormation,
            handleFormationChange,
            Object.keys(formationsData)
          )
        }
      />

      <PlayerSelectModal
        playerSelectModalOpen={playerSelectModalOpen}
        setPlayerSelectModalOpen={setPlayerSelectModalOpen}
        currentPositionType={currentPositionType}
        availablePlayers={availablePlayers}
        selectedPlayers={selectedPlayers}
        selectedPlayer={selectedPlayer}
        addPlayerToPitch={addPlayerToPitch}
      />
    </div>
  );
}

export default App;
