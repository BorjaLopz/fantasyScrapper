import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CircleX,
} from "lucide-react-native";
import { Icon } from "../ui/icon";
import { Card } from "../ui/card";
import { Image } from "../ui/image";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Player } from "@/types/player.type";
import PlayerPositionBadge from "../players/position-badge";

type Props = {
  player: Player;
  id: number;
  onClickFunc: () => void;
};

export default function PlayerCard({ player, id, onClickFunc }: Props) {
  return (
    <div key={id} onClick={onClickFunc} className="cursor-pointer">
      <Card size="md" variant="filled" className="bg-primary-500">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="flex">
              <Image source={player.image} />
              <Image
                source={player.team.badgeColor}
                size="sm"
                className="absolute left-20 w-full max-w-[1.5em] max-h-[1.5em]"
              />
            </div>

            <div className="flex flex-col">
              <Heading
                size="md"
                className="flex items-center gap-2 mb-1 text-typography-0"
              >
                <PlayerPositionBadge position={player.position} />
                {player.nickname}
              </Heading>

              <div className="flex items-center">
                {player.playerStatus === "ok" && (
                  <div className="flex items-center gap-1">
                    <Icon className="text-success-500" as={CircleCheck} />
                    <span className="font-bold text-success-500">
                      Alineable
                    </span>
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
                {player.playerStatus === "suspended" && (
                  <div className="flex items-center gap-1">
                    <Icon className="text-error-500" as={CircleX} />
                    <span className="font-bold text-error-500">Suspendido</span>
                  </div>
                )}
              </div>

              <span className="text-typography-0">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(Number(player.marketValue) || 0)}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline justify-start gap-2">
              <Text className="uppercase font-bold text-typography-600">
                Puntos
              </Text>
              <Text
                className="uppercase font-bold text-typography-0"
                size="2xl"
              >
                {player.points}
              </Text>
            </div>

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
          </div>
        </div>
      </Card>
    </div>
  );
}
