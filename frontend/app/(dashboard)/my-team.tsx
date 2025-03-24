import { PlayerCard } from "@/components/players/player-card";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import {
  createTeamByUserId,
  getTeamByUserId,
} from "@/services/my-team.service";
import { useUserStore } from "@/stores/user.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function MyTeam() {
  const [activeTab, setActiveTab] = useState<"line-up" | "players" | "points">("line-up")
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const {
    data: userTeam,
    isFetching: userTeamLoading,
    isError: userTeamError,
    isFetched,
  } = useQuery({
    queryKey: ["user-team"],
    queryFn: async () => await getTeamByUserId(user.id),
    enabled: !!user.id,
  });
  const {
    mutate,
    isError: creatingError,
    isPending: creatingPending,
    isSuccess,
  } = useMutation({
    mutationFn: async () => createTeamByUserId(user.id),
  });

  if (userTeamLoading || creatingPending) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  if (isFetched && userTeam && userTeam.data === null) {
    mutate();

    if (!creatingPending && isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["user-team"] });
    }
  }

  return (
    <div className="flex flex-col text-typography-0 bg-background-900 w-full h-full">
      {userTeamError && creatingError && (
        <div role="alert" className="alert alert-error alert-outline">
          <span>Oops! Algo ha ido mal.</span>
        </div>
      )}

      {/* TABS */}
      <div className="bg-primary-500">
        <Grid
          className="items-center justify-center gap-2"
          _extra={{
            className: "grid-cols-3",
          }}
        >
          <GridItem
            className={`p-3 cursor-pointer ${activeTab === 'line-up' ? 'underline underline-offset-8' : ''}`}
            _extra={{
              className: "col-span-1",
            }}
          >
            <div onClick={() => {
              setActiveTab("line-up")
            }}>
              <Heading className="text-typography-0 text-center">Alineación</Heading>
            </div>
          </GridItem>

          <GridItem
            className={`p-3 cursor-pointer ${activeTab === 'players' ? 'underline underline-offset-8' : ''}`}
            _extra={{
              className: "col-span-1",
            }}
          >
            <div onClick={() => {
              setActiveTab("players")
            }}>
              <Heading className="text-typography-0 text-center">Plantilla</Heading>
            </div>
          </GridItem>

          <GridItem
            className={`p-3 cursor-pointer ${activeTab === 'points' ? 'underline underline-offset-8' : ''}`}
            _extra={{
              className: "col-span-1",
            }}
          >
            <div onClick={() => {
              setActiveTab("points")
            }}>
              <Heading className="text-typography-0 text-center">Puntos</Heading>
            </div>
          </GridItem>
        </Grid>
      </div>

      <div className="flex flex-col p-2 w-full h-full" style={{ maxHeight: '94.8%' }}>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start">
            <span className="uppercase font-bold">Fichas</span>
            <span>{userTeam?.data.players.length}/24</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="uppercase font-bold">Valor equipo</span>
            <span>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(userTeam?.data.teamValue || 0)}</span>
          </div>
        </div>

        {activeTab === "players" && (
          <div className="flex flex-col gap-2 w-full h-full overflow-auto">
            {userTeam?.data.players.map((player, index) => {
              return <PlayerCard key={index} player={player} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
