import { PlayerCard } from "@/components/players/player-card";
import { Player } from "@/types/player.type";
import { ArrowDownUp } from "lucide-react-native";
import { Fragment } from "react";
import { isSelected } from "./utils";

type Props = {
  playerSelectModalOpen: boolean;
  setPlayerSelectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentPositionType: string;
  availablePlayers: Player[];
  addPlayerToPitch: (player: Player) => void;
  selectedPlayers: Player[];
  selectedPlayer: Player;
};

export default function PlayerSelectModal({
  playerSelectModalOpen,
  setPlayerSelectModalOpen,
  currentPositionType,
  availablePlayers,
  addPlayerToPitch,
  selectedPlayers,
  selectedPlayer,
}: Props) {
  // let suitablePlayers = availablePlayers.filter((player: any) => (player.positionType === currentPositionType ||
  //   player["alternativePositions"].split(/[,;\/\s]+/).includes(currentPositionType)) &&
  //   isSelected(selectedPlayers, player) === false);
  let suitablePlayers = availablePlayers.filter(
    (player: Player) =>
      player.position.toLowerCase() === currentPositionType &&
      !player.market &&
      isSelected(selectedPlayers, player) === false
  );

  return (
    <>
      {playerSelectModalOpen && (
        <dialog id="player-select-modal" className="modal modal-open">
          <div className="modal-box bg-base-300 w-full h-full">
            <h3 className="font-bold text-lg">Cambiar jugador</h3>
            <div className="py-4">
              <div className="flex flex-col gap-2">
                <PlayerCard player={selectedPlayer} cardType="line-up" />
                <div className="flex items-center justify-center w-full">
                  <ArrowDownUp />
                </div>

                <div className="space-y-6">
                  {suitablePlayers.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {suitablePlayers.map((player: Player, id: number) => {
                        return (
                          <Fragment key={id}>
                            <PlayerCard
                              player={player}
                              cardType="line-up"
                              onClickFunc={() => {
                                setPlayerSelectModalOpen(false);
                                addPlayerToPitch(player);
                              }}
                            />
                          </Fragment>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-2xl">
                      <p>No hay jugadores seleccionables</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setPlayerSelectModalOpen(false)}>✕</button>
                <button className="btn btn-primary" onClick={() => setPlayerSelectModalOpen(false)}>Cerrar</button>
              </form>
            </div>
          </div>
        </dialog >
      )
      }

      {/* <Modal
        <ModalContent className="!h-full !p-2 !border-none bg-primary-600">
          <ModalHeader className="mt-2">
            <Heading size="md" className="text-typography-0">
              Cambiar jugador
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              <PlayerCard player={selectedPlayer} id={selectedPlayer.id} />
              <div className="flex items-center justify-center w-full">
                <Icon as={ArrowDownUp} className="text-typography-0" />
              </div>

              <div className="space-y-6">
                {suitablePlayers.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {suitablePlayers.map((player: any, id: number) => {
                      return (
                        <Fragment key={id}>
                          <PlayerCard
                            player={player}
                            id={id}
                            onClickFunc={() => {
                              setPlayerSelectModalOpen(false);
                              addPlayerToPitch(player);
                            }}
                          />
                        </Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-2xl">
                    <p>No hay más</p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => {
                setPlayerSelectModalOpen(false);
              }}
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
  );
}
