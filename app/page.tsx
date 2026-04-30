import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { VehicleCard } from "@/app/components/VehicleCard";
import { NewVehicleDrawer } from "@/app/components/NewVehicleDrawer";
import { Car } from "lucide-react";

export default async function VehiclesPage() {
  const data = await db.select().from(vehicles);
  const propios = data.filter((v) => v.tipo_propiedad === "PROPIO").length;
  const usdTotal = data
    .filter((v) => v.moneda === "USD")
    .reduce((a, v) => a + Number(v.total ?? 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/40 sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Car className="w-5 h-5 stroke-blue-600" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold">
                Gestión de vehículos
              </h1>
              <p className="text-xs text-muted-foreground">
                {data.length} unidades registradas
              </p>
            </div>
          </div>
          <NewVehicleDrawer />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Total flota",
              value: data.length,
              color: "text-blue-700",
            },
            { label: "Propios", value: propios, color: "text-green-700" },
            {
              label: "Alquilados",
              value: data.length - propios,
              color: "text-amber-700",
            },
            {
              label: "Valor USD",
              value: `$${Math.round(usdTotal).toLocaleString()}`,
              color: "",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-muted/40 rounded-xl px-4 py-3 border border-border/40"
            >
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
