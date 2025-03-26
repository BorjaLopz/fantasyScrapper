import { useState, useEffect } from "react";
import Pitch from "./pitch";
import PlayerSelectModal from "./player-select.modal";
import { renderPositions, renderFormationSelector } from "./renderer";
import InformationModal from "./information.modal";
import { availableFormations } from "./formations";
import { DISPLAY_NUMBER } from "./utils";
import { Player } from "@/types/player.type";
import { useMutation } from "@tanstack/react-query";
import { updatePlayersPosisitionName } from "@/services/my-team.service";

type Props = {
  players: Player[];
};

function App({ players }: Props) {
  const [selectedFormation, setSelectedFormation] = useState(""); // The current selected formation
  const [formationsData, setFormationsData] = useState<any>([]); // The available formations and their data
  const [playerPositions, setPlayerPositions] = useState([]); // The positions of the palyers on the pitch (For example which position to render the GK to)
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
    mutateAsync,
    isError: creatingError,
    isPending: creatingPending,
    isSuccess,
  } = useMutation({
    mutationFn: async () => updatePlayersPosisitionName(playersToUpdate),
  });

  const updateDimensions = () => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
  };

  const handleFormationChange = (newFormation: any) => {
    setSelectedFormation(newFormation); // Chaning to formation
    setPlayerPositions(formationsData[newFormation]["positions"]); // Loading the position data
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
    mutateAsync();
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
    // if (selectedPlayerFromBench === null) // If user want to add player from the the modal (not from the bench)
    // {
    //   setCurrentPositionType(positionType); // Setting the type of the position
    //   setSelectedPosition(index); // Setting the id(the exact position) to know where to add
    //   setPlayerSelectModalOpen(true); // Opening the modal
    // }
    // else // If user  want to add/swap player from the bench into the squad
    // {
    //   addPlayerFromBenchToSquad(index, positionType)
    // }
  };

  // const addPlayerFromBenchToSquad = (index: number, positionType: any) => { // swap Player from bench and starting XI or adding from the bench to the starting XI
  //   setIsToastOpen(false) // Closing the toast indicating whic player we slected from the bench
  //   if (selectedPlayerFromBench["positionType"] !== positionType &&
  //     !selectedPlayerFromBench["alternativePositions"].split(/[,;\/\s]+/).includes(positionType)) { // If the selected player's position is not compatible with the position we want to put him in
  //     setSelectedPlayerFromBench(null) // Setting the player selected from the bench back to null
  //     setInformationModalOpen(true) // Open the information modal
  //     setInformationModalType("wrong_position")
  //     setInformationModalMessage(`${selectedPlayerFromBench["name"]},${selectedPlayerFromBench["positionType"]},${positionType}`)
  //     return
  //   }
  //   let oldSelectedPlayers = selectedPlayers;
  //   // oldSelectedPlayers = oldSelectedPlayers.filter(selectedPlayer => selectedPlayer.position.toLowerCase() !== index); // Filter out the player on the selected position

  //   const currentSelectedPlayerFromBench = selectedPlayerFromBench
  //   currentSelectedPlayerFromBench["positionOnPitch"] = index // Setting the player's position
  //   setSelectedPlayers([...oldSelectedPlayers, currentSelectedPlayerFromBench]) // Adding player to the starting XI
  //   setSelectedPlayerFromBench(null) // Setting the player selected from the bench back to null
  // }

  const removePlayerFromPitch = (e: any, index: number) => {
    // Removing player from the starting XI
    // e.stopPropagation(); // Stopping the PlayerSelectModal from opening
    // let oldSelectedPlayers = selectedPlayers
    // setSelectedPlayers(oldSelectedPlayers.filter(player => player.positionOnPitch !== index)) // Filter out the player from the selected players(starting XI) that on the position we want to clear
  };

  useEffect(() => {
    // loading the formations and setting some default values
    try {
      let jsonData: any = Object.entries(availableFormations);
      setFormationsData(availableFormations);
      setPlayerPositions(jsonData[0][1]["positions"]);
      setSelectedFormation(jsonData[0][0]);
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
            removePlayerFromPitch,
            screenWidth,
            handlePositionClick
          )
        }
        renderFormationSelector={() =>
          renderFormationSelector(
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
        addPlayerToPitch={addPlayerToPitch}
        selectedPlayers={selectedPlayers}
      />
      {/* 
      <InformationModal
        informationModalOpen={informationModalOpen}
        setInformationModalOpen={setInformationModalOpen}
        informationModalType={informationModalType}
        informationModalMessage={informationModalMessage}
      /> */}
    </div>
  );
}

export default App;
