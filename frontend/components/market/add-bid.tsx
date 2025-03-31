import { Player } from "@/types/player.type"
import React from "react"
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar"
import { Button, ButtonText } from "../ui/button"
import { Heading } from "../ui/heading"
import { CloseIcon, Icon, SearchIcon } from "../ui/icon"
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "../ui/modal"
import { Input, InputSlot, InputIcon, InputField } from "../ui/input"

type Props = {
  player: Player
  bidOpen: boolean;
  setBidOpen: (state: boolean) => void
}

export default function AddBid({ player, bidOpen, setBidOpen }: Props) {

  return (
    <Modal
      isOpen={bidOpen}
      onClose={() => {
        setBidOpen(false)
      }}
      size="full"
      className="h-full"
    >
      <ModalBackdrop />
      <ModalContent className="h-full">
        <ModalHeader>
          <Heading size="md" className="text-typography-950">
            Pujar por {player.nickname}
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
          <div className="flex flex-col items-center justify-center gap-5 mt-10 w-full h-full">
            {/* <Image /> */}
            <Avatar size="lg">
              <AvatarFallbackText>{player.name}</AvatarFallbackText>
              <AvatarImage
                source={{ uri: player.image }}
              />
            </Avatar>

            {/* Values */}
            <div className="flex flex-col items-center w-10/12">
              <div className="grid grid-cols-4 items-end justify-end gap-2 w-full">
                <span className="col-span-3 font-semibold uppercase text-start">Valor del mercado</span>
                <span className="text-end w-full">
                  {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(Number(player.marketValue) || 0)}
                </span>
              </div>

              <div className="grid grid-cols-4 justify-between gap-2 w-full">
                <span className="col-span-3 font-semibold uppercase text-start">Precio solicitado</span>
                <span className="text-end w-full">
                  {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(Number(player.marketValue) || 0)}
                </span>
              </div>

              {/* Bid */}
              <div className="flex w-full mt-4">
                <Input className="w-full">
                  <InputSlot className="pl-3">
                    <InputIcon as={SearchIcon} />
                  </InputSlot>
                  <InputField placeholder="Importe..." />
                </Input>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={() => {
              setBidOpen(false)
            }}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={() => {
              setBidOpen(false)
            }}
          >
            <ButtonText>Explore</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}