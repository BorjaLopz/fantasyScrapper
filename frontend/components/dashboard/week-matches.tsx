
import { getAllMatchdays, getAllMatchesForMatchday, getCurrentMatchday } from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

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

  if (
    matchesLoading ||
    currentMatchdayLoading ||
    allMatchdaysLoading
  ) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  return (
    <>
      {matchesError && currentMatchdayError && allMatchdaysError && (
        <div role="alert" className="alert alert-error alert-outline">
          <span>Oops! Algo ha ido mal.</span>
        </div>
      )}

      {/* All matchdays */}
      <div className='w-full' style={{ maxWidth: '100%' }}>
        <div className="card bg-base-100 shadow-xl w-full">
          <div className='card-body p-2'>
            <h2 className='card-title justify-center'>Jornadas</h2>

            <div ref={matchdaysRef}
              // w-[21%]
              className="flex items-center gap-2 py-2 overflow-x-auto scroll-snap-x-container">
              {allMatchdays?.data.map((matchday, index) => {
                if (matchday.gameWeek <= (currentMatchday?.data || 0))
                  return (
                    <div className="avatar placeholder">
                      <div className={`${matchday.gameWeek == currentMatchday?.data
                        ? "bg-primary"
                        : "bg-base-300 text-base-content"} text-neutral-content w-8 rounded-full`}>
                        <span className="text-xs font-semibold">{matchday.gameWeek}</span>
                      </div>
                    </div>
                    // <div key={index} className={`cursor-pointer ${matchday.gameWeek == currentMatchday?.data
                    //   ? "bg-primary"
                    //   : "bg-secondary text-base-content"
                    //   }`}>
                    //   <span>{matchday.gameWeek}</span>
                    // </div>
                  );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Matches component */}
      < div style={{ width: '100%', maxWidth: '100%' }
      }>
        <div className="card bg-base-100">
          <div className='card-body p-2'>
            <h2 className='card-title justify-center'>
              <span className="font-bold">Partidos</span>
              <span className='font-thin'>jornada {currentMatchday?.data}</span>
            </h2>

            <div className="flex flex-col items-center justify-center gap-2">
              {matches?.data.map((match, index) => (
                <div key={index} className="card bg-base-300 w-full">
                  <h3 className="flex items-center justify-center gap-2 mb-1">
                    <span>{match.homeTeam}</span>
                    <span>{match.score !== "" ? match.score : "-"}</span>
                    <span>{match.awayTeam}</span>
                  </h3>
                  <p className="font-thin text-center">
                    {`${new Date(match.date).getDate()}-${new Date(match.date).getMonth() + 1
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
                // </div> */}
                //       </div>
                //     </div>
              ))}
            </div>
          </div>
        </div>
      </div >
    </>
  )
}