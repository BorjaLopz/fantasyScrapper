import SquadBuilder from "@/components/field/squad-builder";
import { PlayerCard } from "@/components/players/player-card";
import {
  getTeamByUserId
} from "@/services/my-team.service";
import { useUserStore } from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function MyTeam() {
  const [activeTab, setActiveTab] = useState<
    "line-up" | "players" | "stadistics"
  >("line-up");
  const { user } = useUserStore();
  const {
    data: userTeam,
    isFetching: userTeamLoading,
    isError: userTeamError,
  } = useQuery({
    queryKey: ["user-team"],
    queryFn: async () => await getTeamByUserId(user.id),
    enabled: !!user.id,
  });

  if (userTeamLoading) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  return (
    <div className="flex flex-col bg-base-300 w-full h-full">
      {userTeamError && (
        <div role="alert" className="alert alert-error alert-outline">
          <span>Oops! Algo ha ido mal.</span>
        </div>
      )}

      {/* TABS */}
      <div className="bg-base-100">
        <div role="tablist" className="tabs tabs-bordered p-2">
          <a role="tab" className={`tab ${activeTab === 'line-up' && 'tab-active'}`} onClick={() => setActiveTab("line-up")}>Alineación</a>
          <a role="tab" className={`tab ${activeTab === 'players' && 'tab-active'}`} onClick={() => setActiveTab("players")}>Plantilla</a>
          <a role="tab" className="tab tab-disabled">Estadisticas</a>
        </div>
      </div>

      <div
        className="flex flex-col p-2 w-full h-full"
        style={{ maxHeight: "94.8%" }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start">
            <span className="uppercase font-bold">Fichas</span>
            <span>{userTeam?.data?.players?.length}/24</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="uppercase font-bold">Valor equipo</span>
            <span>
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(userTeam?.data.teamValue || 0)}
            </span>
          </div>
        </div>

        {/* LINE UP */}
        {activeTab === "line-up" && (
          <div className="flex flex-col gap-2 w-full h-full overflow-auto">
            <SquadBuilder
              players={userTeam?.data.players || []}
              formation={userTeam?.data.formation || ""}
              teamId={userTeam?.data.id!}
            />
          </div>
        )}

        {/* MY TEAM PLAYERS */}
        {activeTab === "players" && (
          <div className="flex flex-col gap-2 w-full h-full overflow-auto">
            {userTeam?.data?.players
              .sort((a, b) => (a.positionId > b.positionId ? 1 : -1))
              ?.map((player, index) => {
                return <PlayerCard key={index} player={player} cardType="players" />;
              })}
          </div>
        )}

        {/* MY TEAM PLAYERS */}
        {activeTab === "stadistics" && (
          <div className="flex flex-col gap-2 w-full h-full overflow-auto">
            {userTeam?.data?.players
              .sort((a, b) => (a.positionId > b.positionId ? 1 : -1))
              ?.map((player, index) => {
                return <div key={index}></div>;
              })}
          </div>
        )}
      </div>
    </div>
  );
}
