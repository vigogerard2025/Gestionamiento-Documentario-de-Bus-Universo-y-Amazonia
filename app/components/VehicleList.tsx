"use client";

import { VehicleCard } from "./VehicleCard";

export function VehicleList({ vehicles }: { vehicles: any[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} />
      ))}
    </div>
  );
}
