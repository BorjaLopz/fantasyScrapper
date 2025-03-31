import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import { Player } from "@/types/player.type";
import { CircleAlert, CircleCheck, CircleHelp, Clock, User } from "lucide-react-native";
import React, { useState } from "react";
import PlayerPositionBadge from "./position-badge";
import AddBid from "../market/add-bid";

interface Props {
  player: Player;
  fromMarket?: boolean
}

export function PlayerCard({ player, fromMarket = false }: Props) {
  const [bidOpen, setBidOpen] = useState(false)

  if (player === undefined) return <div>Loading...</div>;

  console.log("player", player)

  return (
    <Card size="md" variant="filled" className="p-2 bg-primary-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-5 w-7/12">
          <div className="flex">
            <Image source={player.image} />
            <Image
              source={player.team.badgeColor}
              size="sm"
              className="absolute left-20 w-full max-w-[1.5em] max-h-[1.5em]"
            />
          </div>

          <div className="flex flex-col w-full truncate">
            <Heading
              size="md"
              className="flex items-center gap-2 mb-1 text-typography-0"
            >
              <PlayerPositionBadge position={player.position} />
              <span className="w-full truncate">{player.nickname}</span>
            </Heading>

            {fromMarket && (
              <div className="flex items-center gap-1">
                <Icon className="text-typography-0" as={User} />
                <span className="font-bold text-typography-0">
                  {player.userTeam ? player.userTeam.user.username : "LA LIGA"}
                </span>
              </div>
            )}

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
                  <span className="font-bold text-error-500">
                    No disponible
                  </span>
                </div>
              )}
            </div>

            {fromMarket ? (
              <div className="flex items-center gap-1">
                <Icon className="text-typography-0" as={Clock} />
                <span className="font-bold text-typography-0">Dudoso</span>
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
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-baseline justify-start gap-2">
            <Text className="uppercase font-bold text-typography-600">
              PFSY
            </Text>
            <Text className="uppercase font-bold text-typography-0" size="2xl">
              {player.points}
            </Text>
          </div>

          {fromMarket ? (
            <div className="flex items-center justify-end gap-2">
              <Text className="font-bold text-typography-600">
                Valor
              </Text>
              <Text className="font-bold text-typography-0">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(Number(player.marketValue) || 0)}
              </Text>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <Text className="uppercase font-bold text-typography-600">
                Media
              </Text>
              <Text className="uppercase font-bold text-typography-0">
                {Number(player.averagePoints || "0")
                  .toFixed(2)
                  .replace(".", ",")}
              </Text>
            </div>
          )}

          <Menu
            placement="bottom"
            offset={5}
            closeOnSelect={true}
            trigger={({ ...triggerProps }) => {
              return (
                <Button
                  {...triggerProps}
                  size="sm"
                  variant="solid"
                  action="negative"
                  className="mt-2"
                >
                  <ButtonText>Acciones</ButtonText>
                </Button>
              );
            }}
          >
            {fromMarket ? (
              <MenuItem key="Pujar" textValue="Pujar" onPress={() => setBidOpen(true)}>
                {/* <Icon as={AddIcon} size="sm" className="mr-2" /> */}
                <MenuItemLabel className="w-full" size="sm">
                  Pujar
                </MenuItemLabel>
              </MenuItem>
            ) : (
              <MenuItem key="Add account" textValue="Add account">
                {/* <Icon as={AddIcon} size="sm" className="mr-2" /> */}
                <MenuItemLabel size="sm">Subir cláusula</MenuItemLabel>
              </MenuItem>
            )}
          </Menu>
        </div>
      </div>
      <AddBid player={player} bidOpen={bidOpen} setBidOpen={setBidOpen} />
    </Card>
  );
}
