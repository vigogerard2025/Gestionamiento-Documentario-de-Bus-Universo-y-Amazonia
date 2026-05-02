"use client";

import { VehicleCard } from "./VehicleCard";
import type { VehicleRow } from "@/types/fleet";

export function VehicleList({ vehicles }: { vehicles: VehicleRow[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((v) => (
        <VehicleCard
          key={v.id}
          vehicle={v}
          onClick={() => {
            console.log("Seleccionado:", v.id);
          }}
        />
      ))}
    </div>
  );
}
