import { Player } from "@/types/player.type";
import { CircleAlert, CircleCheck, CircleHelp, CirclePlus, CircleX, Clock, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import PlayerPositionBadge from "./position-badge";
import AddBid from "../market/add-bid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPlayerToMarket, removePlayerFromMarket } from "@/services/market.service";
import { useUserStore } from "@/stores/user.store";

interface Props {
  player: Player;
  cardType: "market" | "players" | "line-up";
  onClickFunc?: () => void;
}

export function PlayerCard({ player, cardType = "players", onClickFunc }: Props) {
  const queryClient = useQueryClient()
  const [bidOpen, setBidOpen] = useState(false)
  const [countdown, setCountdown] = useState<string>("")
  const { user } = useUserStore()

  const {
    mutateAsync: mutatePlayerToMarket,
    isError: playerToMarketError,
    isPending: playerToMarketPending,
    isSuccess: playerToMarketSuccess,
  } = useMutation({
    mutationFn: async (data: { userId: string, playerId: string }) => addPlayerToMarket(data.playerId),
  });
  const {
    mutateAsync: mutateRemovePlayerFromMarket,
    isError: removePlayerFromMarketError,
    isPending: removePlayerFromMarketPending,
    isSuccess: removePlayerFromMarketSuccess,
  } = useMutation({
    mutationFn: async (data: { playerId: string }) => removePlayerFromMarket(data.playerId),
  });

  const getRemainingTime = () => {
    setInterval(function () {
      var toDate = new Date();
      var tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      var diffMS = tomorrow.getTime() / 1000 - toDate.getTime() / 1000;
      var diffHr = Math.floor(diffMS / 3600);
      diffMS = diffMS - diffHr * 3600;
      var diffMi = Math.floor(diffMS / 60);
      diffMS = diffMS - diffMi * 60;
      var diffS = Math.floor(diffMS);
      var result = ((diffHr < 10) ? "0" + diffHr : diffHr);
      result += ":" + ((diffMi < 10) ? "0" + diffMi : diffMi);
      result += ":" + ((diffS < 10) ? "0" + diffS : diffS);

      setCountdown(String(result))
    }, 1000);
  }

  useEffect(() => {
    if (cardType === "market") getRemainingTime()
  }, [cardType])

  if (playerToMarketSuccess) {
    queryClient.invalidateQueries({ queryKey: ['market', "user-team"] })
  }

  if (removePlayerFromMarketSuccess) {
    queryClient.invalidateQueries({ queryKey: ['market', "user-team"] })
  }

  if (player === undefined || playerToMarketPending || removePlayerFromMarketPending) return;

  return (
    <div className={`card card-side shadow ${player.market && player.market.id ? 'bg-base-300' : 'bg-base-100'}`} onClick={onClickFunc}>
      <figure className="size-[8rem] min-w-18 min-h-18 h-full bg-base-300">
        <div className="flex p-1 w-full h-full">
          <img
            src={player.image}
            className="size-28"
            alt="Player image" />

          <img
            src={player.team.badgeColor}
            className="absolute size-6"
            alt="Player team image" />
        </div>
      </figure>

      <div className="card-body p-2 w-full">
        <div className="flex items-center w-full">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="card-title truncate">
              <PlayerPositionBadge position={player.position} />
              <span className={`${player.market && player.market.id && 'line-through'}`}>{player.nickname}</span>
              <span className="text-sm font-normal self-end">
                {(cardType === "market" && player.marketBids.length > 0) && (
                  <span>({player.marketBids.length} pujas)</span>
                )}
              </span>
            </h2>

            <div className="flex items-start w-full">
              <div className="flex flex-col w-full">
                {cardType === "market" && (
                  <div className="flex items-center gap-1">
                    <User className="size-4" />
                    <span>
                      {player.userTeam ? player.userTeam.user.username : "LA LIGA"}
                    </span>
                  </div>
                )}

                {player.playerStatus === "ok" && (
                  <div className="flex items-center gap-1">
                    <CircleCheck className="size-4 text-success" />
                    <span className="text-success">Alineable</span>
                  </div>
                )}
                {player.playerStatus === "injured" || player.playerStatus === "doubtful" && (
                  <div className="flex items-center gap-1">
                    <CircleHelp className="size-4 text-warning" />
                    <span className="text-warning">Dudoso</span>
                  </div>
                )}
                {player.playerStatus === "out_of_league" && (
                  <div className="flex items-center gap-1">
                    <CircleAlert className="size-4 text-error" />
                    <span className="text-error">
                      No disponible
                    </span>
                  </div>
                )}
                {player.playerStatus === "suspended" && (
                  <div className="flex items-center gap-1">
                    <CircleX className="size-4 text-error" />
                    <span className="text-error">
                      Suspendido
                    </span>
                  </div>
                )}
                {player.playerStatus === "injured" && (
                  <div className="flex items-center gap-1">
                    <CirclePlus className="size-4 text-error" />
                    <span className="text-error">
                      Lesionado
                    </span>
                  </div>
                )}

                {cardType === "market" ? (
                  <div className="flex items-center gap-1 text-info">
                    <Clock className="size-4" />
                    {countdown}
                  </div>
                ) : (
                  <span>
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(Number(player.marketValue) || 0)}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-end justify-end">
                <div className="flex items-center justify-start gap-2">
                  <span className="uppercase font-bold">
                    PFSY
                  </span>
                  <span className="uppercase font-bold">
                    {player.points}
                  </span>
                </div>

                {cardType === "market" ? (
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-bold">
                      Valor
                    </span>
                    <span className="font-bold text-typography-0">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(Number(player.marketValue) || 0)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    <span className="uppercase font-bold">
                      Media
                    </span>
                    <span className="uppercase font-bold">
                      {Number(player.averagePoints || "0")
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                  </div>
                )}

                {(cardType === "players" || cardType === "market") && (
                  <div className="card-actions justify-end">
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-sm btn-primary m-1">Acciones</div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-300 border-1 border-secondary rounded-box z-[1] w-52 p-2 shadow">
                        {cardType === "market" ? (
                          <>
                            {player.userTeam?.user.id !== user.id && (
                              <li onClick={() => setBidOpen(true)}><a>Pujar</a></li>
                            )}

                            {player.userTeam?.user.id === user.id && (
                              <li onClick={() => mutateRemovePlayerFromMarket({ playerId: player.id })}><a>Quitar del mercado</a></li>
                            )}
                          </>
                        ) : (
                          <>
                            {/* <li><a>Subir cláusula</a></li> */}
                            <li
                              onClick={() => mutatePlayerToMarket({
                                playerId: player.id,
                                userId: user.id
                              })}
                            ><a>Añadir al mercado</a></li>
                            <li><a>Venta inmediata</a></li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {bidOpen && (
        <AddBid player={player} bidOpen={bidOpen} setBidOpen={setBidOpen} />
      )}
    </div>
  );
}
