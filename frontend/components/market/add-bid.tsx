import { getMarketBid, setMarketBid } from "@/services/market.service"
import { useUserStore } from "@/stores/user.store"
import { Player } from "@/types/player.type"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { EuroIcon } from "lucide-react-native"
import React, { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar"
import { Button, ButtonText } from "../ui/button"
import { Heading } from "../ui/heading"
import { CloseIcon, Icon } from "../ui/icon"
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "../ui/modal"

type Props = {
  player: Player
  bidOpen: boolean;
  setBidOpen: (state: boolean) => void
}

type Inputs = {
  bid: number
}

export default function AddBid({ player, bidOpen, setBidOpen }: Props) {
  const { user } = useUserStore()
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["player-bid"],
    queryFn: async () => await getMarketBid(user.id, player.id),
    enabled: !!user.id && player.marketBids.length > 0,
  })

  const {
    mutateAsync: mutateBid,
    isError: bidError,
    isPending: bidPending,
    isSuccess: bidSuccess,
  } = useMutation({
    mutationFn: async (data: { userId: string, playerId: string, bid: number }) => setMarketBid(data.userId, data.playerId, data.bid),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onTouched"
  })
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutateBid({
      userId: user.id,
      playerId: player.id,
      bid: data.bid
    })

    if (bidSuccess) {
      queryClient.invalidateQueries({ queryKey: ['player-bid'] })
      setBidOpen(false)
    }
  }

  if (isLoading || bidPending) return <span className="loading loading-spinner loading-md"></span>


  return (
    <>
      {bidOpen && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box bg-base-300 w-full h-full">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setBidOpen(false)}>✕</button>
            </form>
            <h3 className="font-bold text-lg">Pujar por {player.nickname}</h3>
            <div className="py-4">
              <div className="flex flex-col items-center justify-center gap-5 mt-10 w-full h-full">
                {/* AVATAR */}
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <img src={player.image} />
                  </div>
                </div>

                {/* VALUES */}
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
                      {player.marketBids.length > 0 ? new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(Number(data?.data.bid) || 0) : new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(Number(player.marketValue) || 0)}
                    </span>
                  </div>

                  {/* BID */}
                  <div className="flex justify-center gap-4 w-full mt-4">
                    <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
                      <label className={`input input-bordered flex items-center gap-2 ${errors.bid ? 'input-error' : ''}`}>
                        <EuroIcon />
                        <input type="text" className="grow" placeholder="Introduce cantidad" {...register("bid", {
                          required: {
                            value: true,
                            message: "La cantidad es necesaria"
                          },
                          min: {
                            value: player.marketValue,
                            message: "El valor debe ser igual o mayor que el precio de mercado"
                          }
                        })} />
                      </label>

                      <button className="btn btn-primary mt-2 w-full">Pujar</button>
                    </form>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </>

    //     <ModalFooter>
    //       <Button
    //         variant="outline"
    //         action="secondary"
    //         onPress={() => {
    //           setBidOpen(false)
    //         }}
    //       >
    //         <ButtonText>Cancel</ButtonText>
    //       </Button>

    //       <button
    //         type="submit"
    //         form="hook-form"
    //         className="btn btn-primary"
    //       >
    //         Pujar
    //       </button>
    //     </ModalFooter>
    //   </ModalContent>
    // </Modal>
  )
}