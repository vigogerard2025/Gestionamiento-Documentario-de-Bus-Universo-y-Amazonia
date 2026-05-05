import {
  getVehiclesWithDocuments,
  calcFleetStats,
  getUpcomingPayments,
  getLoansWithPayments,
} from "./lib/queries";
import { FleetDashboard } from "./components/FleetDashboard";

export const revalidate = 60;

export default async function VehiclesPage() {
  const [vehicles, payments] = await Promise.all([
    getVehiclesWithDocuments(),
    getUpcomingPayments(),
  ]);

  const stats = calcFleetStats(vehicles);
  const loans = await getLoansWithPayments();

  const empresas = Array.from(
    new Map(
      vehicles.map((v) => [
        v.companyId,
        { id: v.companyId, nombre: v.empresa },
      ]),
    ).values(),
  );

  return (
    <FleetDashboard
      vehicles={vehicles}
      stats={stats}
      empresas={empresas}
      payments={payments}
      loans={loans}
    />
  );
}
