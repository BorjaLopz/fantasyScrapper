import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import { Player } from "@/types/player.type";
import { CircleAlert, CircleCheck, CircleHelp, GlobeIcon, PlayIcon, SettingsIcon } from 'lucide-react-native';
import React, { useEffect } from "react";
import { AddIcon, Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import PlayerPositionBadge from "./position-badge";

interface Props {
  player: Player
}

export function PlayerCard({ player }: Props) {

  useEffect(() => {
    console.log("player", player)
  })

  if (player === undefined) return (
    <div>Loading...</div>
  )

  return (
    <Card size="md" variant="filled" className="bg-primary-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="flex">
            <Image source={player.image} />
            <Image source={player.team.badgeColor} size="sm" className="absolute left-20 w-full max-w-[1.5em] max-h-[1.5em]" />
          </div>

          <div className="flex flex-col">
            <Heading size="md" className="flex items-center gap-2 mb-1 text-typography-0">
              <PlayerPositionBadge position={player.position} />
              {player.nickname}
            </Heading>

            <div className="flex items-center">
              {player.playerStatus === "ok" && (
                <div className="flex items-center gap-1">
                  <Icon className="text-success-500" as={CircleCheck} />
                  <span className="font-bold text-success-500">Alineable</span>
                </div>
              )}
              {player.playerStatus === "injured" && (
                <div className="flex items-center gap-1">
                  <Icon className="text-warning-500" as={CircleHelp} />
                  <span className="font-bold text-warning-500">Dudoso</span>
                </div>
              )}
              {player.playerStatus === "out_of_league" && (
                <div className="flex items-center gap-1">
                  <Icon className="text-error-500" as={CircleAlert} />
                  <span className="font-bold text-error-500">No disponible</span>
                </div>
              )}
            </div>

            <span>{new Intl.NumberFormat("es-ES", {
              style: "currency", currency: "EUR", maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }).format(Number(player.marketValue) || 0)}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline justify-start gap-2">
            <Text className="uppercase font-bold text-typography-600">Puntos</Text>
            <Text className="uppercase font-bold text-typography-0" size="2xl">{player.points}</Text>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Text className="uppercase font-bold text-typography-600">Media</Text>
            <Text className="uppercase font-bold text-typography-0">{Number(player.averagePoints || "0").toFixed(2).replace(".", ",")}</Text>

          </div>

          <Menu
            placement="bottom"
            offset={5}
            disabledKeys={["Settings"]}
            trigger={({ ...triggerProps }) => {
              return (
                <Button {...triggerProps} size="sm" variant="solid" action="negative" className="mt-2">
                  <ButtonText>Acciones</ButtonText>
                </Button>
              )
            }}
          >
            <MenuItem key="Add account" textValue="Add account">
              {/* <Icon as={AddIcon} size="sm" className="mr-2" /> */}
              <MenuItemLabel size="sm">Subir cláusula</MenuItemLabel>
            </MenuItem>
          </Menu>
        </div>

      </div>
    </Card>
    // <div className="card card-xs shadow-sm bg-base-300 w-full">
    //   <div className="flex gap-2">
    //     <div className="p-2">
    //       <img src={player.image} style={{ width: "6em" }} />
    //     </div>


    //     <div className="card-body p-2">
    //       <h2 className="card-title">{player.name}</h2>
    //       <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    //       <div className="justify-end card-actions">
    //         <button className="btn btn-primary">Buy Now</button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}