import { differenceInDays, parseISO, isValid } from "date-fns";
import type { DocStatus, DocInfo, VehicleRow } from "@/types/fleet";

// ─── Calcula status dinámico según días restantes ─────────────────────────────

export function calcDocStatus(fechaDeFin: string | null): {
  status: DocStatus;
  diasRestantes: number | null;
} {
  if (!fechaDeFin) return { status: "SIN_DATOS", diasRestantes: null };

  const fin = parseISO(fechaDeFin);
  if (!isValid(fin)) return { status: "SIN_DATOS", diasRestantes: null };

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dias = differenceInDays(fin, hoy);

  let status: DocStatus;
  if (dias < 0) status = "VENCIDO";
  else if (dias <= 7) status = "CRITICO";
  else if (dias <= 30) status = "POR_VENCER";
  else status = "VIGENTE";

  return { status, diasRestantes: dias };
}

// ─── Obtiene el peor status de un vehículo ───────────────────────────────────

const STATUS_PRIORITY: Record<DocStatus, number> = {
  VENCIDO: 0,
  CRITICO: 1,
  POR_VENCER: 2,
  VIGENTE: 3,
  SIN_DATOS: 4,
};

export function getWorstStatus(docs: DocInfo[]): DocStatus {
  if (docs.length === 0) return "SIN_DATOS";
  return docs.reduce((worst, doc) => {
    return STATUS_PRIORITY[doc.status] < STATUS_PRIORITY[worst]
      ? doc.status
      : worst;
  }, "SIN_DATOS" as DocStatus);
}

// ─── Formatea fecha para mostrar ─────────────────────────────────────────────

export function formatDate(d: string | null): string {
  if (!d) return "—";
  const parsed = parseISO(d);
  if (!isValid(parsed)) return "—";
  return parsed.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Texto de días restantes para mostrar ─────────────────────────────────────

export function formatDiasRestantes(
  dias: number | null,
  status: DocStatus,
): string {
  if (status === "SIN_DATOS") return "Sin datos";
  if (dias === null) return "—";
  if (dias < 0) return `Venció hace ${Math.abs(dias)}d`;
  if (dias === 0) return "Vence hoy";
  return `${dias}d restantes`;
}

// ─── Filtra y ordena vehículos ────────────────────────────────────────────────

export function filterVehicles(
  vehicles: VehicleRow[],
  filters: {
    empresa: string;
    tipoUnidad: string;
    estado: string;
    propiedad: string;
    search: string;
  },
): VehicleRow[] {
  return vehicles.filter((v) => {
    if (filters.empresa !== "all" && v.companyId.toString() !== filters.empresa)
      return false;
    if (filters.propiedad !== "all" && v.tipoPropiedad !== filters.propiedad)
      return false;
    if (filters.estado !== "all" && v.worstStatus !== filters.estado)
      return false;
    if (filters.tipoUnidad !== "all") {
      const isBus =
        v.tipoDeVehiculo?.toLowerCase().includes("ómnibus") ||
        v.tipoDeVehiculo?.toLowerCase().includes("omnibus");
      if (filters.tipoUnidad === "BUS" && !isBus) return false;
      if (filters.tipoUnidad === "CAMION" && isBus) return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const text = [v.placa, v.descripcion, v.marca, v.modelo, v.empresa]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });
}
