import { differenceInDays, parseISO, isValid } from "date-fns";
import type { DocStatus, DocInfo, VehicleRow } from "@/types/fleet";
import * as XLSX from "xlsx";
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

export function formatDiasRestantes(
  dias: number | null,
  status: DocStatus,
): string {
  if (status === "SIN_DATOS") return "Sin datos";
  if (dias === null) return "—";
  if (dias < 0) return `Venció hace ${Math.abs(dias)}d`;
  if (dias === 0) return "Vence hoy";
  if (status === "CRITICO") return `${dias}d — CRÍTICO`;
  return `${dias}d restantes`;
}

// ─── FIX PRINCIPAL: agrupa CRITICO con VENCIDO en el filtro de estado ─────────
// El sidebar muestra "Vencido / crítico" → filtra ambos VENCIDO y CRITICO
// "POR_VENCER" solo filtra POR_VENCER (días 8-30)

function matchesEstadoFilter(
  worstStatus: DocStatus,
  filterEstado: string,
): boolean {
  if (filterEstado === "all") return true;
  // "VENCIDO" en el filtro captura también CRITICO
  if (filterEstado === "VENCIDO") {
    return worstStatus === "VENCIDO" || worstStatus === "CRITICO";
  }
  return worstStatus === filterEstado;
}

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
    if (!matchesEstadoFilter(v.worstStatus, filters.estado)) return false;
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

export function exportVehiclesToExcel(
  vehicles: VehicleRow[],
  filename = "flota",
) {
  const rows = vehicles.map((v) => ({
    Placa: v.placa ?? "—",
    Empresa: v.empresa,
    Descripción: v.descripcion,
    Marca: v.marca,
    Modelo: v.modelo ?? "—",
    Tipo: v.tipoDeVehiculo ?? "—",
    Propiedad: v.tipoPropiedad,
    Modalidad: v.modalidadDeCompra ?? "—",
    Moneda: v.moneda ?? "—",
    Total: Number(v.total ?? 0),
    "SOAT Vence": v.soat.fin ?? "Sin datos",
    "SOAT Estado": v.soat.status,
    "Rev. Técnica Vence": v.rt.fin ?? "Sin datos",
    "Rev. Técnica Estado": v.rt.status,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 10 },
    { wch: 22 },
    { wch: 24 },
    { wch: 16 },
    { wch: 16 },
    { wch: 20 },
    { wch: 10 },
    { wch: 12 },
    { wch: 8 },
    { wch: 12 },
    { wch: 14 },
    { wch: 12 },
    { wch: 18 },
    { wch: 14 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Flota");
  XLSX.writeFile(
    wb,
    `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
}

export function exportPaymentsToExcel(
  payments: any[],
  filename = "cronograma",
) {
  const ws = XLSX.utils.json_to_sheet(payments);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cronograma");
  XLSX.writeFile(
    wb,
    `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
}
