import * as XLSX from "xlsx";
import type { VehicleRow } from "@/types/fleet";

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
