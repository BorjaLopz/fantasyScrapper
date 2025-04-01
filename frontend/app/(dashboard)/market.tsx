import { PlayerCard } from "@/components/players/player-card";
import { getMarketPlayers } from "@/services/market.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Market() {
  const [activeTab, setActiveTab] = useState<
    "market" | "historic"
  >("market");
  const {
    data: market,
    isFetching: marketLoading,
    isError: marketError,
  } = useQuery({
    queryKey: ["market"],
    queryFn: async () => await getMarketPlayers(),
  });

  if (marketLoading) return <span className="loading loading-spinner loading-md"></span>

  return (
    <div className="flex flex-col bg-base-300 w-full h-full">
      {/* TABS */}
      <div className="bg-base-100">
        <div role="tablist" className="tabs tabs-bordered p-2">
          <a role="tab" className={`tab ${activeTab === 'market' && 'tab-active'}`} onClick={() => setActiveTab("market")}>Mercado</a>
          <a role="tab" className="tab tab-disabled">Histórico</a>
        </div>
      </div>

      <div
        className="flex flex-col p-2 w-full h-full"
        style={{ maxHeight: "94.8%" }}
      >
        {activeTab === "market" && (
          <div className="flex flex-col gap-2 w-full h-full overflow-auto">
            {market?.data.players.map((player, index) => {
              return <PlayerCard key={index} player={player} cardType="market" />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
