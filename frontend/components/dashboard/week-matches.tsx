
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { getAllMatchdays, getAllMatchesForMatchday, getCurrentMatchday } from '@/services/dashboard.service';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallbackText } from '../ui/avatar';

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
      <div style={{ maxWidth: '100%' }}>
        <Card size="md" variant="filled" className="m-3 border-none bg-primary-500">
          <Heading size="md" className="mb-1 text-center text-typography-0 uppercase">
            Jornadas
          </Heading>

          <div ref={matchdaysRef}
            // w-[21%]
            className="flex items-center gap-2 py-2 overflow-x-auto scroll-snap-x-container">
            {allMatchdays?.data.map((matchday, index) => {
              if (matchday.gameWeek <= (currentMatchday?.data || 0))
                return (
                  <Avatar key={index} size="sm" className={`cursor-pointer ${matchday.gameWeek == currentMatchday?.data
                    ? "bg-blue-500"
                    : "bg-secondary-50 text-typography-black"
                    }`}>
                    <span>{matchday.gameWeek}</span>
                  </Avatar>
                );
            })}
          </div>
        </Card >
      </div >

      {/* Matches component */}
      < div style={{ width: '100%', maxWidth: '100%' }
      }>
        <Card size="md" variant="filled" className="m-3 border-none bg-primary-500">
          <Heading size="md" className="mb-1 flex items-center justify-center gap-2 uppercase text-typography-0">
            <span className="font-bold">Partidos</span>
            <span className='font-thin'>jornada {currentMatchday?.data}</span>
          </Heading>

          <div className="flex flex-col items-center justify-center gap-2">
            {matches?.data.map((match, index) => (
              <Card key={index} size="md" variant="filled" className="w-full">
                <Heading size="md" className="flex items-center justify-center gap-2 mb-1">
                  <span>{match.homeTeam}</span>
                  <span>{match.score !== "" ? match.score : "-"}</span>
                  <span>{match.awayTeam}</span>
                </Heading>
                <Text size="sm" className="font-thin text-center">
                  {`${new Date(match.date).getDate()}-${new Date(match.date).getMonth() + 1
                    }-${new Date(match.date).getFullYear()} ${match.startTime}`}
                </Text>
              </Card>
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
        </Card>
      </div >
    </>
  )
}