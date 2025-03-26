import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Player } from "@/types/player.type";
import { Fragment } from "react";
import PlayerCard from "./player-card";
import { isSelected } from "./utils";

type Props = {
  playerSelectModalOpen: boolean;
  setPlayerSelectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentPositionType: string;
  availablePlayers: Player[];
  addPlayerToPitch: (player: Player) => void;
  selectedPlayers: Player[];
};

export default function PlayerSelectModal({
  playerSelectModalOpen,
  setPlayerSelectModalOpen,
  currentPositionType,
  availablePlayers,
  addPlayerToPitch,
  selectedPlayers,
}: Props) {
  // let suitablePlayers = availablePlayers.filter((player: any) => (player.positionType === currentPositionType ||
  //   player["alternativePositions"].split(/[,;\/\s]+/).includes(currentPositionType)) &&
  //   isSelected(selectedPlayers, player) === false);
  let suitablePlayers = availablePlayers.filter(
    (player: Player) =>
      player.position.toLowerCase() === currentPositionType &&
      isSelected(selectedPlayers, player) === false
  );

  return (
    <>
      <Modal
        isOpen={playerSelectModalOpen}
        onClose={() => {
          setPlayerSelectModalOpen(false);
        }}
        size="full"
        className="!h-full"
      >
        <ModalBackdrop />
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
      </Modal>
    </>
  );
}
