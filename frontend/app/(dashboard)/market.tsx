import { PlayerCard } from "@/components/players/player-card";
import { getMarketPlayers } from "@/services/market.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Market() {
  const {
    data: market,
    isFetching: userTeamLoading,
    isError: userTeamError,
    isFetched,
  } = useQuery({
    queryKey: ["market"],
    queryFn: async () => await getMarketPlayers(),
  });

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-2 w-full h-full overflow-auto">
        {market?.data.players.map((player, index) => {
          return <PlayerCard key={index} player={player} />;
        })}
      </div>
    </div>
  );
}
