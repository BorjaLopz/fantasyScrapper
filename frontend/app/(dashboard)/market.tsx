import { PlayerCard } from "@/components/players/player-card";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { getMarketPlayers } from "@/services/market.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  if (marketLoading) return <Spinner size="large" color="bg-primary-50" />

  return (
    <div className="flex flex-col text-typography-0 bg-background-900 w-full h-full">
      {/* TABS */}
      <div className="bg-primary-500">
        <Grid
          className="items-center justify-center gap-2"
          _extra={{
            className: "grid-cols-3",
          }}
        >
          <GridItem
            className={`p-3 cursor-pointer ${activeTab === "market" ? "underline underline-offset-8" : ""
              }`}
            _extra={{
              className: "col-span-1",
            }}
          >
            <div
              onClick={() => {
                setActiveTab("market");
              }}
            >
              <Heading className="text-typography-0 text-center">
                Mercado
              </Heading>
            </div>
          </GridItem>

          <GridItem
            className={`p-3 cursor-pointer ${activeTab === "historic" ? "underline underline-offset-8" : ""
              }`}
            _extra={{
              className: "col-span-1",
            }}
          >
            <div
            // onClick={() => {
            //   setActiveTab("stadistics");
            // }}
            >
              <Heading className="text-typography-500 text-center">
                Histórico
              </Heading>
            </div>
          </GridItem>
        </Grid>
      </div>

      <div
        className="flex flex-col p-2 w-full h-full"
        style={{ maxHeight: "94.8%" }}
      >
        <div className="flex flex-col gap-2 w-full h-full overflow-auto">
          {market?.data.players.map((player, index) => {
            return <PlayerCard key={index} player={player} fromMarket={true} />;
          })}
        </div>
      </div>
    </div>
  );
}
