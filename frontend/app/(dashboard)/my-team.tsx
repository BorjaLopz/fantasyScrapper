import {
  createTeamByUserId,
  getTeamByUserId,
} from "@/services/my-team.service";
import { useUserStore } from "@/stores/user.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function TabTwoScreen() {
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
    <div className="flex flex-col">
      {userTeamError && creatingError && (
        <div role="alert" className="alert alert-error alert-outline">
          <span>Oops! Algo ha ido mal.</span>
        </div>
      )}

      {userTeam?.data.players.map((player, index) => {
        return <span key={index}>{player.name}</span>;
      })}
    </div>
  );
}
