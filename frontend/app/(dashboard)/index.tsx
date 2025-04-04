
import { WeekMatches } from "@/components/dashboard/week-matches";

export default function HomeScreen() {
  return (
    <div className="flex flex-col gap-4 items-center p-4 bg-base-300 w-full h-full overflow-y-auto">
      {/* Intro */}
      <div className="text-center">
        <h4>
          Bienvenido al mejor Fantsy del mercado, donde no hay ratas que metan
          clausulazos!!!
        </h4>
      </div>

      <WeekMatches />
    </div>
  );
}
