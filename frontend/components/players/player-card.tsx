import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import { Player } from "@/types/player.type";
import { CircleAlert, CircleCheck, CircleHelp, CircleX, Clock, User } from "lucide-react-native";
import React, { useState } from "react";
import AddBid from "../market/add-bid";
import PlayerPositionBadge from "./position-badge";

interface Props {
  player: Player;
  fromMarket?: boolean
}

export function PlayerCard({ player, fromMarket = false }: Props) {
  const [bidOpen, setBidOpen] = useState(false)

  if (player === undefined) return <div>Loading...</div>;

  return (
    <div className="card card-side bg-base-100 shadow-xl">
      <figure>
        <div className="flex p-1 bg-base-300">
          <img
            src={player.image}
            className="size-32"
            alt="Movie" />

          <img
            src={player.team.badgeColor}
            className="absolute size-6"
            alt="Movie" />
        </div>
      </figure>
      <div className="card-body p-2">
        <h2 className="card-title truncate">
          <PlayerPositionBadge position={player.position} />
          {player.nickname}
        </h2>


        <div className="flex flex-col">
          {fromMarket && (
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

          {fromMarket ? (
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span className="">Clock</span>
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


        <div className="card-actions justify-end">
          <button className="btn btn-primary">Watch</button>
        </div>
      </div >
    </div >




    //       <div className="flex flex-col items-end">
    //         <div className="flex items-baseline justify-start gap-2">
    //           <Text className="uppercase font-bold text-typography-600">
    //             PFSY
    //           </Text>
    //           <Text className="uppercase font-bold text-typography-0" size="2xl">
    //             {player.points}
    //           </Text>
    //         </div>

    //         {fromMarket ? (
    //           <div className="flex items-center justify-end gap-2">
    //             <Text className="font-bold text-typography-600">
    //               Valor
    //             </Text>
    //             <Text className="font-bold text-typography-0">
    //               {new Intl.NumberFormat("es-ES", {
    //                 style: "currency",
    //                 currency: "EUR",
    //                 maximumFractionDigits: 0,
    //                 minimumFractionDigits: 0,
    //               }).format(Number(player.marketValue) || 0)}
    //             </Text>
    //           </div>
    //         ) : (
    //           <div className="flex items-center justify-end gap-2">
    //             <Text className="uppercase font-bold text-typography-600">
    //               Media
    //             </Text>
    //             <Text className="uppercase font-bold text-typography-0">
    //               {Number(player.averagePoints || "0")
    //                 .toFixed(2)
    //                 .replace(".", ",")}
    //             </Text>
    //           </div>
    //         )}

    //         {(fromMarket && player.marketBids.length > 0) && (
    //           <span>{player.marketBids.length} pujas</span>
    //         )}
    //         <Menu
    //           placement="bottom"
    //           offset={5}
    //           closeOnSelect={true}
    //           trigger={({ ...triggerProps }) => {
    //             return (
    //               <Button
    //                 {...triggerProps}
    //                 size="sm"
    //                 variant="solid"
    //                 action="negative"
    //                 className="mt-2"
    //               >
    //                 <ButtonText>Acciones</ButtonText>
    //               </Button>
    //             );
    //           }}
    //         >
    //           {fromMarket ? (
    //             <MenuItem key="Pujar" textValue="Pujar" onPress={() => setBidOpen(true)}>
    //               {/* <Icon as={AddIcon} size="sm" className="mr-2" /> */}
    //               <MenuItemLabel className="w-full" size="sm">
    //                 Pujar
    //               </MenuItemLabel>
    //             </MenuItem>
    //           ) : (
    //             <MenuItem key="Add account" textValue="Add account">
    //               {/* <Icon as={AddIcon} size="sm" className="mr-2" /> */}
    //               <MenuItemLabel size="sm">Subir cláusula</MenuItemLabel>
    //             </MenuItem>
    //           )}
    //         </Menu>
    //       </div>
    //     </div>
    //     <AddBid player={player} bidOpen={bidOpen} setBidOpen={setBidOpen} />
    //   </div>
    // </div>
  );
}
