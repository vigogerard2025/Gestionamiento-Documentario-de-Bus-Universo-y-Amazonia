import { getVehiclesWithDocuments, calcFleetStats } from "./lib/queries";
import { FleetDashboard } from "./components/FleetDashboard";

// Forzar revalidación cada 60s (o usa revalidatePath desde actions)
export const revalidate = 60;

export default async function VehiclesPage() {
  const vehicles = await getVehiclesWithDocuments();
  const stats = calcFleetStats(vehicles);

  // Obtener lista de empresas únicas para el filtro
  const empresas = Array.from(
    new Map(
      vehicles.map((v) => [
        v.companyId,
        { id: v.companyId, nombre: v.empresa },
      ]),
    ).values(),
  );

  return (
    <FleetDashboard vehicles={vehicles} stats={stats} empresas={empresas} />
  );
}
