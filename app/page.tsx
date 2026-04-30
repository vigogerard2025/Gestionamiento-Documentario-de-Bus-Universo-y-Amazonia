import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { VehicleList } from "@/app/components/VehicleList";

export default async function VehiclesPage() {
  const data = await db.select().from(vehicles);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Vehículos</h1>

      <VehicleList vehicles={data} />
    </div>
  );
}
