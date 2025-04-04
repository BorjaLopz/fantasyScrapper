import { getLeague } from "@/services/league.service";
import { useQuery } from "@tanstack/react-query";

export default function League() {
  const {
    data: league,
    isLoading: leagueLoading,
    isError: leagueError,
  } = useQuery({
    queryKey: ["league"],
    queryFn: () => getLeague(),
  });

  if (leagueLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    )
  }

  if (leagueError) {
    return (
      <div role="alert" className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error! Algo ha ido mal.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 items-center bg-base-300 w-full h-full overflow-y-auto">
      <div className="card bg-base-100 w-full">
        <div className="card-body p-2">
          <h3 className="card-title justify-center">Clasificación</h3>
        </div>
      </div>

      <div className="p-2 w-full h-full">
        {league?.data.map((lg, index) => (
          <div key={index} className="card bg-base-100 w-full">
            <div className="card-body flex !flex-row items-center justify-between p-2">
              <div className="flex items-center space-x-4">
                <span className="font-bold text-lg">{index + 1}</span>
                <div className="avatar placeholder">
                  <div className="bg-base-300 text-neutral-content rounded-full w-10">
                    <span className="text-xl">
                      {lg.user.username.match(/(\b\S)?/g)?.join("").match(/(^\S|\S$)?/g)?.join("").toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{lg.user.username}</p>
                  <p className="text-sm text-gray-500">
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(Number(lg.value) || 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{lg.points}</span>
                <span className="text-sm text-gray-500">PPSY</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}