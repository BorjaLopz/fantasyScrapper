import { PlayerCard } from "@/components/players/player-card";
import { getMarketPlayers } from "@/services/market.service";
import { useUserStore } from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Market() {
  const [activeTab, setActiveTab] = useState<
    "market" | "historic"
  >("market");
  const { user } = useUserStore()

  const {
    data: market,
    isFetching: marketLoading,
    isError: marketError,
  } = useQuery({
    queryKey: ["market"],
    queryFn: async () => await getMarketPlayers(),
  });

  if (marketLoading) return <span className="loading loading-spinner loading-md"></span>
  if (marketError) return (
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
    <div className="flex flex-col bg-base-300 w-full h-full">
      {/* TABS */}
      <div className="bg-base-100">
        <div role="tablist" className="tabs tabs-bordered p-2">
          <a role="tab" className={`tab ${activeTab === 'market' && 'tab-active'}`} onClick={() => setActiveTab("market")}>Mercado</a>
          <a role="tab" className="tab tab-disabled">Histórico</a>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 p-2 w-full h-full"
        style={{ maxHeight: "94.8%" }}
      >
        <div className="flex items-center gap-2 justify-end p-2 rounded-box bg-base-100">
          <span className="uppercase">
            Presupuesto:
          </span>
          <span className="font-bold">
            {new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }).format(Number(user.bank.quantity) || 0)}
          </span>
        </div>

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
