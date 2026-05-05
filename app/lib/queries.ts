import { db } from "@/app/db";
import {
  companies,
  vehicles,
  vehicleDocuments,
  documentTypes,
} from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { calcDocStatus, getWorstStatus } from "./fleet";
import type { DocInfo, VehicleRow } from "@/types/fleet";
import { loans, loanPayments } from "@/app/db/schema";
import type { Payment } from "@/types/fleet";
// ─── Query principal: trae vehículos con todos sus documentos ─────────────────

export async function getVehiclesWithDocuments(): Promise<VehicleRow[]> {
  // 1. Traer todos los vehículos con su empresa
  const rows = await db
    .select()
    .from(vehicles)
    .leftJoin(companies, eq(vehicles.companyId, companies.id))
    .orderBy(companies.nombre, vehicles.descripcion);

  // 2. Traer todos los documentos de todos los vehículos (una sola query)
  const allDocs = await db
    .select()
    .from(vehicleDocuments)
    .leftJoin(
      documentTypes,
      eq(vehicleDocuments.documentTypeId, documentTypes.id),
    );

  // 3. Indexar documentos por vehicleId
  const docsByVehicle = new Map<number, typeof allDocs>();
  for (const doc of allDocs) {
    const id = doc.vehicle_documents.vehicleId;
    if (!docsByVehicle.has(id)) docsByVehicle.set(id, []);
    docsByVehicle.get(id)!.push(doc);
  }

  // 4. Ensamblar VehicleRow
  const EMPTY_DOC: DocInfo = {
    id: null,
    nombre: "",
    inicio: null,
    fin: null,
    status: "SIN_DATOS",
    diasRestantes: null,
    archivoUrl: null,
    archivoNombre: null,
    notas: null,
  };

  return rows.map(({ vehicles: v, companies: c }) => {
    const vehicleDocs = docsByVehicle.get(v.id) ?? [];

    const documents: Record<string, DocInfo> = {};

    for (const { vehicle_documents: vd, document_types: dt } of vehicleDocs) {
      if (!dt) continue;
      const { status, diasRestantes } = calcDocStatus(vd.fechaDeFin);
      const key = dt.nombre; // "SOAT", "REVISION TECNICA", etc.
      documents[key] = {
        id: vd.id,
        nombre: dt.nombre,
        inicio: vd.fechaDeInicio,
        fin: vd.fechaDeFin,
        status,
        diasRestantes,
        archivoUrl: vd.archivoUrl,
        archivoNombre: vd.archivoNombre,
        notas: vd.notas,
      };
    }

    const soat = documents["SOAT"] ?? { ...EMPTY_DOC, nombre: "SOAT" };
    const rt = documents["REVISION TECNICA"] ?? {
      ...EMPTY_DOC,
      nombre: "REVISION TECNICA",
    };

    const worstStatus = getWorstStatus(Object.values(documents));

    return {
      id: v.id,
      placa: v.placa,
      descripcion: v.descripcion,
      marca: v.marca,
      modelo: v.modelo,
      tipoDeVehiculo: v.tipoDeVehiculo,
      uso: v.uso,
      tipoPropiedad: v.tipoPropiedad,
      modalidadDeCompra: v.modalidadDeCompra,
      moneda: v.moneda,
      total: v.total,
      fechaDeAdquisicion: v.fechaDeAdquisicion,
      companyId: v.companyId,
      empresa: c?.nombre ?? "—",
      documents,
      soat,
      rt,
      worstStatus,
    };
  });
}

// ─── Stats para los KPI cards ─────────────────────────────────────────────────
export async function getLoansWithPayments() {
  return db.query.loans.findMany({
    with: {
      payments: true,
      company: true,
      vehicle: true,
    },
  });
}
export type FleetStats = {
  total: number;
  propios: number;
  alquilados: number;
  valorUsd: number;
  soatVencidos: number;
  soatPorVencer: number;
  rtVencidos: number;
  rtPorVencer: number;
  alertasTotal: number;
};

export function calcFleetStats(vehicles: VehicleRow[]): FleetStats {
  const stats: FleetStats = {
    total: vehicles.length,
    propios: 0,
    alquilados: 0,
    valorUsd: 0,
    soatVencidos: 0,
    soatPorVencer: 0,
    rtVencidos: 0,
    rtPorVencer: 0,
    alertasTotal: 0,
  };

  for (const v of vehicles) {
    if (v.tipoPropiedad === "PROPIO") stats.propios++;
    else stats.alquilados++;

    const total = Number(v.total ?? 0);
    if (v.moneda === "USD") stats.valorUsd += total;
    else stats.valorUsd += total / 3.75; // tipo de cambio referencial

    if (v.soat.status === "VENCIDO" || v.soat.status === "CRITICO")
      stats.soatVencidos++;
    if (v.soat.status === "POR_VENCER") stats.soatPorVencer++;
    if (v.rt.status === "VENCIDO" || v.rt.status === "CRITICO")
      stats.rtVencidos++;
    if (v.rt.status === "POR_VENCER") stats.rtPorVencer++;
  }

  stats.alertasTotal =
    stats.soatVencidos +
    stats.soatPorVencer +
    stats.rtVencidos +
    stats.rtPorVencer;

  return stats;
}
export async function getUpcomingPayments(): Promise<Payment[]> {
  const rows = await db
    .select({
      loanId: loanPayments.loanId,
      entidad: loans.entidad,
      tipo: loans.tipo,
      nroCuota: loanPayments.nroCuota,
      fechaVencimiento: loanPayments.fechaVencimiento,
      total: loanPayments.total,
      moneda: loans.moneda,
      vehiclePlaca: vehicles.placa,
      pagado: loanPayments.pagado,
    })
    .from(loanPayments)
    .innerJoin(loans, eq(loanPayments.loanId, loans.id))
    .leftJoin(vehicles, eq(loans.vehicleId, vehicles.id))
    .where(eq(loanPayments.pagado, false))
    .orderBy(loanPayments.fechaVencimiento);

  return rows.map((r) => ({
    loanId: r.loanId,
    entidad: r.entidad,
    tipo: r.tipo as "PRESTAMO" | "LEASING",
    nroCuota: r.nroCuota,
    fechaVencimiento: r.fechaVencimiento,
    total: r.total ?? "0",
    moneda: r.moneda as "SOL" | "USD",
    vehiclePlaca: r.vehiclePlaca,
    pagado: r.pagado ?? false,
  }));
}
