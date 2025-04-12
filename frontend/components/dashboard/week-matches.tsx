import {
  getAllMatchdays,
  getAllMatchesForMatchday,
  getCurrentMatchday,
} from "@/services/dashboard.service";
import { Match, Matchday } from "@/types/match.type";
import getTeamIcon from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Image, View, Text } from "react-native";

export function WeekMatches() {
  const matchdaysRef = useRef<HTMLDivElement | null>(null);
  const [matchday, setMatchday] = useState<number | null>(null);
  const {
    data: matches,
    isLoading: matchesLoading,
    isError: matchesError,
  } = useQuery({
    queryKey: ["matches", matchday],
    queryFn: () => getAllMatchesForMatchday(matchday),
  });
  const {
    data: currentMatchday,
    isLoading: currentMatchdayLoading,
    isError: currentMatchdayError,
  } = useQuery({
    queryKey: ["currentMatchday"],
    queryFn: () => getCurrentMatchday(),
  });
  const {
    data: allMatchdays,
    isLoading: allMatchdaysLoading,
    isError: allMatchdaysError,
  } = useQuery({
    queryKey: ["allMatchdays"],
    queryFn: () => getAllMatchdays(),
  });

  useEffect(() => {
    if (matchdaysRef && matchdaysRef.current) {
      matchdaysRef.current.scrollLeft += 2000;
    }
  });

  if (matchesLoading || currentMatchdayLoading || allMatchdaysLoading) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  console.log("matches: ", matches);

  const handleChangeMatchesBy = (newMatchDay: Matchday) => {
    console.log("Vamos a pulsar en: ", newMatchDay.gameWeek);
    setMatchday(newMatchDay.gameWeek);
  };

  const getWeekdayName = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  };

  const getFormattedDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${
      weekday.charAt(0).toUpperCase() + weekday.slice(1)
    }, ${day}-${month}-${year}`;
  };

  const groupMatchesByWeekday = (matches: Match[]) => {
    return matches.reduce((acc, match) => {
      const date = new Date(match.date);
      const dateKey = date.toISOString().split("T")[0]; // Obtenemos, por ejemplo, 2025-04-11

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(match);
      return acc;
    }, {} as Record<string, Match[]>);
  };

  const groupedMatches = groupMatchesByWeekday(matches.data);

  return (
    <>
      {matchesError && currentMatchdayError && allMatchdaysError && (
        <div role="alert" className="alert alert-error alert-outline">
          <span>Oops! Algo ha ido mal.</span>
        </div>
      )}

      {/* All matchdays */}
      <div className="w-full" style={{ maxWidth: "100%" }}>
        <div className="card bg-base-100 shadow-xl w-full">
          <div className="card-body p-2">
            <h2 className="card-title justify-center">Jornadas</h2>

            <div
              ref={matchdaysRef}
              // w-[21%]
              className="flex items-center gap-2 py-2 overflow-x-auto scroll-snap-x-container"
            >
              {allMatchdays?.data.map((matchday_test, index) => {
                if (matchday_test.gameWeek <= (currentMatchday?.data || 0)) {
                  const isSelected = matchday_test.gameWeek === matchday;
                  return (
                    <div key={index} className="avatar placeholder">
                      <div
                        // className={`${
                        //   matchday_test.gameWeek == currentMatchday?.data
                        //     ? "bg-primary hover:cursor-default"
                        //     : "bg-base-300 text-base-content  hover:cursor-pointer hover:bg-slate-600/50"
                        // } text-neutral-content w-8 rounded-full`}
                        className={`${
                          isSelected
                            ? "bg-primary text-white hover:cursor-default" // estilo de jornada seleccionada
                            : "bg-base-300 text-base-content hover:cursor-pointer hover:bg-slate-600/50"
                        } text-neutral-content w-8 rounded-full flex items-center justify-center`}
                        onClick={() => handleChangeMatchesBy(matchday_test)}
                      >
                        <span className="text-xs font-semibold">
                          {matchday_test.gameWeek}
                        </span>
                      </div>
                    </div>
                    // <div key={index} className={`cursor-pointer ${matchday.gameWeek == currentMatchday?.data
                    //   ? "bg-primary"
                    //   : "bg-secondary text-base-content"
                    //   }`}>
                    //   <span>{matchday.gameWeek}</span>
                    // </div>
                  );
                }
                // if (matchday.gameWeek <= (currentMatchday?.data || 0))
                //   return (
                //     <div className="avatar placeholder">
                //       <div
                //         className={`${
                //           matchday.gameWeek == currentMatchday?.data
                //             ? "bg-primary hover:cursor-default"
                //             : "bg-base-300 text-base-content  hover:cursor-pointer hover:bg-slate-600/50"
                //         } text-neutral-content w-8 rounded-full`}
                //         onClick={() => handleChangeMatchesBy(matchday)}
                //       >
                //         <span className="text-xs font-semibold">
                //           {matchday.gameWeek}
                //         </span>
                //       </div>
                //     </div>
                //     // <div key={index} className={`cursor-pointer ${matchday.gameWeek == currentMatchday?.data
                //     //   ? "bg-primary"
                //     //   : "bg-secondary text-base-content"
                //     //   }`}>
                //     //   <span>{matchday.gameWeek}</span>
                //     // </div>
                //   );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Matches component */}
      <div style={{ width: "100%", maxWidth: "100%" }}>
        <div className="card bg-base-100">
          <div className="card-body p-2">
            <h2 className="card-title justify-center">
              <span className="font-bold">Partidos</span>
              <span className="font-thin capitalize">jornada {matchday}</span>
            </h2>

            {Object.entries(groupedMatches).map(([dateKey, matchesByDate]) => (
              <div key={dateKey} className="space-y-2">
                <h3 className="text-center text-lg font-semibold">
                  {getFormattedDate(dateKey)}
                </h3>
                {matchesByDate.map((match, index) => (
                  <div
                    key={index}
                    className="card bg-base-300 w-full h-[2.4rem] flex items-center justify-center"
                  >
                    <h4 className="flex items-center justify-center gap-2 w-full h-full">
                      <span className="flex-1 text-right flex items-center justify-end">
                        <Image
                          source={getTeamIcon(match.homeTeam)}
                          style={{ width: 25, height: 25, marginRight: 10 }} // Ajusta el tamaño según sea necesario
                        />
                        {match.homeTeam}
                      </span>
                      <span>
                        {match.score !== ""
                          ? match.score
                          : `${match.startTime}h`}
                      </span>
                      <span className="flex-1 text-left flex items-center">
                        {match.awayTeam}
                        <Image
                          source={getTeamIcon(match.awayTeam)}
                          style={{ width: 25, height: 25, marginLeft: 10 }} // Ajusta el tamaño según sea necesario
                        />
                      </span>
                    </h4>
                    <p className="font-thin text-center"></p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/*  <div className="flex flex-col items-center justify-center gap-2">
              {matches?.data.map((match, index) => (
                <div key={index} className="card bg-base-300 w-full">
                  <h3 className="flex items-center justify-center gap-2 mb-1">
                    <span>{match.homeTeam}</span>
                    <span>{match.score !== "" ? match.score : "-"}</span>
                    <span>{match.awayTeam}</span>
                  </h3>
                  <p className="font-thin text-center">
                    {`${getWeekdayName(match.date)} - ${new Date(
                      match.date
                    ).getDate()}-${
                      new Date(match.date).getMonth() + 1
                    }-${new Date(match.date).getFullYear()} ${match.startTime}`}
                  </p>
                </div>
                //     <div
                //       key={index}
                //       className="card w-96 bg-base-100 card-xs shadow-sm"
                //     >
                //       <div className="card-body items-center">
                //         <h2 className="card-title justify-center w-full">
                //           <span>{match.homeTeam}</span>
                //           <span>{match.score !== "" ? match.score : "-"}</span>
                //           <span>{match.awayTeam}</span>
                //         </h2>
                //         <p className="font-thin">
                //           {`${new Date(match.date).getDate()}-${new Date(match.date).getMonth() + 1
                //             }-${new Date(match.date).getFullYear()} ${match.startTime}`}
                //         </p>
                //         {/* <div className="justify-end card-actions">
                //   <button className="btn btn-primary">Buy Now</button>
                // </div> }
                //       </div>
                //     </div>
              ))}
            </div>*/
