import { getMarketBid, setMarketBid } from "@/services/market.service"
import { useUserStore } from "@/stores/user.store"
import { Player } from "@/types/player.type"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { EuroIcon } from "lucide-react-native"
import React from "react"
import CurrencyInput from 'react-currency-input-field'
import { SubmitHandler, useForm } from "react-hook-form"

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
    watch,
    setValue
  } = useForm<Inputs>({
    mode: "onTouched",
    defaultValues: {
      bid: Number(player.marketValue)
    }
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
  if (isError) return (
    <div role="alert" className="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Error! Algo ha ido mal.</span>
    </div>
  )

  return (
    <dialog className="modal modal-open">
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
              <div className="w-[6em] rounded-full border border-secondary">
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
                    <CurrencyInput
                      className="grow"
                      placeholder="Introduce cantidad"
                      {...register("bid", {
                        required: {
                          value: true,
                          message: "La cantidad es necesaria"
                        },
                        min: {
                          value: player.marketValue,
                          message: "El valor debe ser igual o mayor que el precio de mercado"
                        },
                      })}
                      allowDecimals={false}
                      groupSeparator="."
                      defaultValue={
                        player.marketBids.length > 0 ?
                          player.marketBids[0].bid :
                          Number(player.marketValue)
                      }
                      onValueChange={(value) => setValue("bid", Number(value))}
                    />
                  </label>
                  {errors.bid && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.bid.message}</span>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary mt-2 w-full">Pujar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}