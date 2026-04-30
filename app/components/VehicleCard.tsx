"use client";

import { Card, CardContent } from "./ui/card";

type Vehicle = {
  id: number;
  descripcion: string;
  marca: string;
  modelo?: string | null;
  placa?: string | null;
  moneda?: string | null;
  total?: string | null;
  tipo_propiedad: string;
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all">
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{vehicle.descripcion}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100">
            {vehicle.tipo_propiedad}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          {vehicle.marca} {vehicle.modelo}
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="font-medium">Placa:</span>
          <span>{vehicle.placa}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="font-medium">Valor:</span>
          <span>
            {vehicle.moneda} {vehicle.total}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
