
import { WeekMatches } from "@/components/dashboard/week-matches";
import { Heading } from "@/components/ui/heading";

export default function HomeScreen() {

  return (
    <div className="flex flex-col gap-4 items-center p-4 text-typography-0 bg-background-900 w-full h-full overflow-y-auto">
      {/* Intro */}
      <div className="text-center">
        <Heading className="text-typography-0">Bienvenido al mejor Fantsy del mercado, donde no hay ratas que metan
          clausulazos!!!</Heading>
      </div>

      <WeekMatches />
    </div>
  );
}
