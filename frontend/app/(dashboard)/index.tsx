import { Redirect } from "expo-router";

import { useAuthSession } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import {
  getAllMatchdays,
  getAllMatchesForMatchday,
  getCurrentMatchday,
} from "@/services/dashboard.service";
import { forwardRef, useEffect, useRef, useState } from "react";

export default function HomeScreen() {
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

  if (
    matchesLoading ||
    currentMatchdayLoading ||
    allMatchdaysLoading
  ) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  return (
    <div className="flex flex-col gap-4 items-center p-2 bg-base-300 w-full h-full overflow-y-auto">
      {matchesError && currentMatchdayError && allMatchdaysError && (
        <div role="alert" className="alert alert-error alert-outline">
          <span>Oops! Algo ha ido mal.</span>
        </div>
      )}
      {/* Intro */}
      <div className="text-center">
        <p>
          Bienvenido al mejor Fantsy del mercado, donde no hay ratas que metan
          clausulazos!!!
        </p>
      </div>

      {/* All matchdays */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="flex items-center gap-2 uppercase">
          <span className="font-bold">Jornadas</span>
        </h3>

        <div
          ref={matchdaysRef}
          className="flex items-center gap-2 py-2 overflow-x-auto scroll-snap-x-container w-[21%]"
        >
          {allMatchdays?.data.map((matchday, index) => {
            if (matchday.gameWeek <= (currentMatchday?.data || 0))
              return (
                <div key={index} className="avatar avatar-placeholder">
                  <div
                    className={`text-neutral-content w-10 rounded-full ${
                      matchday.gameWeek === currentMatchday?.data
                        ? "bg-primary"
                        : "bg-neutral"
                    }`}
                  >
                    <span className="text-xl">{matchday.gameWeek}</span>
                  </div>
                </div>
              );
          })}
        </div>
      </div>

      {/* Matches component */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="flex items-center gap-2 uppercase">
          <span className="font-bold">Partidos</span>
          <span>jornada {currentMatchday?.data}</span>
        </h3>

        <div className="flex flex-col gap-2">
          {matches?.data.map((match, index) => (
            <div
              key={index}
              className="card w-96 bg-base-100 card-xs shadow-sm"
            >
              <div className="card-body items-center">
                <h2 className="card-title justify-center w-full">
                  <span>{match.homeTeam}</span>
                  <span>{match.score !== "" ? match.score : "-"}</span>
                  <span>{match.awayTeam}</span>
                </h2>
                <p className="font-thin">
                  {`${new Date(match.date).getDate()}-${
                    new Date(match.date).getMonth() + 1
                  }-${new Date(match.date).getFullYear()} ${match.startTime}`}
                </p>
                {/* <div className="justify-end card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
