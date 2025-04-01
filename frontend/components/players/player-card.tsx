import { Player } from "@/types/player.type";
import { CircleAlert, CircleCheck, CircleHelp, CircleX, Clock, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import PlayerPositionBadge from "./position-badge";
import AddBid from "../market/add-bid";

interface Props {
  player: Player;
  cardType: "market" | "players" | "line-up";
  onClickFunc?: () => void;
}

export function PlayerCard({ player, cardType = "players", onClickFunc }: Props) {
  const [bidOpen, setBidOpen] = useState(false)
  const [countdown, setCountdown] = useState<string>("")

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

  if (player === undefined) return <div>Loading...</div>;

  return (
    <div className="card card-side bg-base-100 shadow" onClick={onClickFunc}>
      <figure className="size-[8rem] min-w-18 min-h-18 bg-base-300">
        <div className="flex p-1 w-full h-full">
          <img
            src={player.image}
            className="w-full h-full"
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
              {player.nickname}
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

                {cardType === "market" ? (
                  <div className="flex items-center gap-1 text-warning">
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

                {(cardType === "market" && player.marketBids.length > 0) && (
                  <span>{player.marketBids.length} pujas</span>
                )}

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
                          <li onClick={() => setBidOpen(true)}><a>Pujar</a></li>
                        ) : (
                          <li onClick={() => setBidOpen(true)}><a>Subir cláusula</a></li>
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
