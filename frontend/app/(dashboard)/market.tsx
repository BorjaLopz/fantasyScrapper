import { PlayerCard } from "@/components/players/player-card";
import { getMarketPlayers, getOperations } from "@/services/market.service";
import { useUserStore } from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Market() {
  const [activeTab, setActiveTab] = useState<
    "market" | "operations" | "historic"
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

  const {
    data: operations,
    isFetching: operationsLoading,
    isError: operationsError,
  } = useQuery({
    queryKey: ["operations"],
    queryFn: async () => await getOperations(user.id),
    enabled: activeTab === "operations"
  });

  if (marketLoading || operationsLoading) return <span className="loading loading-spinner loading-md"></span>
  if (marketError || operationsError) return (
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
          <a role="tab" className={`tab ${activeTab === 'operations' && 'tab-active'}`} onClick={() => setActiveTab("operations")}>Op. en curso</a>
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

        {activeTab === "operations" && (
          <div className="flex flex-col gap-2 w-full h-full overflow-auto">
            {operations?.data.map((data, index) => (

              <div className="collapse collapse-plus bg-base-200" key>
              <input type="radio" name="my-accordion-3" defaultChecked />
              <div className="collapse-title text-xl font-medium">Click to open this one and close others</div>
              <div className="collapse-content">
                <p>hello</p>
              </div>
            </div>
            )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
