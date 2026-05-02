"use client";

import { Search } from "lucide-react";
import type { VehicleRow, FleetFilters } from "@/types/fleet";
import { VehicleCard } from "./VehicleCard";

type Props = {
  vehicles: VehicleRow[];
  filters: FleetFilters;
  onFilterChange: <K extends keyof FleetFilters>(
    key: K,
    value: FleetFilters[K],
  ) => void;
  onVehicleClick: (v: VehicleRow) => void;
};

export function VehicleGrid({
  vehicles,
  filters,
  onFilterChange,
  onVehicleClick,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search + quick filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por placa, marca, modelo…"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-background border border-border/40 rounded-lg outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {vehicles.length} resultado{vehicles.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      {vehicles.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">🚌</p>
          <p className="text-sm font-medium">Sin resultados</p>
          <p className="text-xs mt-1">
            Intenta cambiar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onClick={() => onVehicleClick(v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
