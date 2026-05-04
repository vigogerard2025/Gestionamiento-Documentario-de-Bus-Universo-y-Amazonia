import "dotenv/config";
import { db } from "../db";
import { vehicles, vehicleDocuments, documentTypes } from "../db/schema";
import { eq, and } from "drizzle-orm";

// ─── Helper: calcula estado según fecha fin ───────────────────────────────────
function calcEstado(
  fin: string,
): "VIGENTE" | "POR_VENCER" | "VENCIDO" | "SIN_DATOS" {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const finDate = new Date(fin + "T00:00:00");
  const dias = Math.floor(
    (finDate.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (dias < 0) return "VENCIDO";
  if (dias <= 30) return "POR_VENCER"; // agrupa "crítico" + "por vencer" en el enum de BD
  return "VIGENTE";
}

// ─── Datos SOAT ───────────────────────────────────────────────────────────────
const soatData: { placa: string; inicio: string; fin: string }[] = [
  // AMAZONIA TOURS
  { placa: "AKW-788", inicio: "2025-03-22", fin: "2027-04-22" },
  { placa: "D1M-825", inicio: "2025-01-15", fin: "2026-01-15" }, // VENCIDO
  { placa: "T8C-855", inicio: "2025-08-28", fin: "2026-08-28" },
  { placa: "TFM-869", inicio: "2025-09-22", fin: "2026-09-22" },
  { placa: "TFP-846", inicio: "2025-10-08", fin: "2026-10-08" },
  { placa: "TFM-919", inicio: "2025-09-22", fin: "2026-09-22" },
  { placa: "TFM-884", inicio: "2025-09-22", fin: "2026-09-22" },
  { placa: "TFM-912", inicio: "2025-09-22", fin: "2026-09-22" },
  { placa: "TFM-937", inicio: "2025-09-22", fin: "2026-09-22" },
  { placa: "TFM-924", inicio: "2025-09-22", fin: "2026-09-22" },
  { placa: "TFM-813", inicio: "2025-09-22", fin: "2026-09-22" },
  { placa: "P4M-783", inicio: "2025-12-10", fin: "2026-12-10" },
  // TURISMO BUS UNIVERSO
  { placa: "B4H955", inicio: "2025-09-26", fin: "2026-09-26" },
  { placa: "T2H961", inicio: "2025-09-26", fin: "2026-09-26" },
  { placa: "A1O964", inicio: "2025-09-26", fin: "2026-09-26" },
  { placa: "T3C967", inicio: "2025-08-26", fin: "2026-08-26" },
  { placa: "F1U967", inicio: "2026-01-09", fin: "2026-09-26" },
  { placa: "T5N953", inicio: "2025-08-29", fin: "2026-08-29" },
  { placa: "C2M964", inicio: "2025-12-23", fin: "2026-09-26" },
  { placa: "C9I955", inicio: "2026-02-18", fin: "2027-02-18" },
  { placa: "D3N950", inicio: "2025-10-21", fin: "2026-10-21" },
  { placa: "T1F968", inicio: "2026-02-13", fin: "2027-02-13" },
  { placa: "T3Q962", inicio: "2025-09-26", fin: "2026-09-26" },
  { placa: "D1B952", inicio: "2025-09-26", fin: "2026-09-26" },
  { placa: "B7C965", inicio: "2025-09-26", fin: "2026-09-26" },
  { placa: "D5Y-957", inicio: "2025-12-04", fin: "2026-12-04" },
  { placa: "TFL-901", inicio: "2025-10-03", fin: "2026-10-03" },
  { placa: "TFM-833", inicio: "2025-10-03", fin: "2026-10-03" },
  { placa: "TFM-911", inicio: "2025-10-03", fin: "2026-10-03" },
  { placa: "TFM-913", inicio: "2025-10-03", fin: "2026-10-03" },
  { placa: "TFL-935", inicio: "2025-10-03", fin: "2026-10-03" },
  { placa: "TFL-944", inicio: "2025-09-10", fin: "2026-09-10" },
  { placa: "TFL-915", inicio: "2025-09-10", fin: "2026-09-10" },
  { placa: "TFL-943", inicio: "2025-09-10", fin: "2026-09-10" },
  { placa: "TFL-914", inicio: "2025-09-10", fin: "2026-09-10" },
  { placa: "TFM-832", inicio: "2025-10-03", fin: "2026-10-03" },
];

// ─── Datos Revisión Técnica ───────────────────────────────────────────────────
const rtData: { placa: string; inicio: string; fin: string }[] = [
  // AMAZONIA TOURS
  { placa: "AKW-788", inicio: "2025-08-02", fin: "2026-08-02" },
  { placa: "D1M-825", inicio: "2025-12-27", fin: "2026-12-27" },
  { placa: "T8C-855", inicio: "2025-09-01", fin: "2026-09-01" },
  { placa: "P4M-783", inicio: "2026-05-10", fin: "2027-05-10" },
  // TURISMO BUS UNIVERSO
  { placa: "B4H955", inicio: "2026-01-19", fin: "2026-05-19" }, // POR_VENCER
  { placa: "T2H961", inicio: "2026-01-08", fin: "2026-07-08" },
  { placa: "A1O964", inicio: "2025-12-13", fin: "2026-06-13" },
  { placa: "T3C967", inicio: "2026-03-31", fin: "2026-09-30" },
  { placa: "F1U967", inicio: "2026-02-09", fin: "2026-08-09" },
  { placa: "T5N953", inicio: "2025-11-25", fin: "2026-05-25" }, // POR_VENCER
  { placa: "C2M964", inicio: "2025-12-26", fin: "2026-06-26" },
  { placa: "C9I955", inicio: "2025-11-25", fin: "2026-05-25" }, // POR_VENCER
  { placa: "D3N950", inicio: "2025-12-08", fin: "2026-06-08" },
  { placa: "T1F968", inicio: "2026-02-14", fin: "2026-08-14" },
  { placa: "T3Q962", inicio: "2025-12-08", fin: "2026-06-08" },
  { placa: "D1B952", inicio: "2026-03-30", fin: "2026-09-30" },
  { placa: "B7C965", inicio: "2025-12-10", fin: "2026-06-10" },
  { placa: "D5Y-957", inicio: "2025-12-08", fin: "2026-06-08" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 Iniciando seed de vehicle_documents...\n");

  // 1. Obtener IDs de document_types
  const allDocTypes = await db.select().from(documentTypes);
  const soatType = allDocTypes.find((d) => d.nombre === "SOAT");
  const rtType = allDocTypes.find((d) => d.nombre === "REVISION TECNICA");

  if (!soatType)
    throw new Error(
      '❌ No existe document_type "SOAT". Ejecuta primero el seed de documentTypes.',
    );
  if (!rtType)
    throw new Error(
      '❌ No existe document_type "REVISION TECNICA". Ejecuta primero el seed de documentTypes.',
    );

  console.log(`✅ SOAT id=${soatType.id} | REVISION TECNICA id=${rtType.id}\n`);

  // 2. Obtener todos los vehículos indexados por placa
  const allVehicles = await db.select().from(vehicles);
  const vehicleByPlaca = new Map(allVehicles.map((v) => [v.placa, v.id]));

  let insertados = 0;
  let actualizados = 0;
  let noEncontrados: string[] = [];

  // ─── Helper: upsert ───────────────────────────────────────────────────────
  async function upsert(
    vehicleId: number,
    docTypeId: number,
    inicio: string,
    fin: string,
  ) {
    const estado = calcEstado(fin);

    const existing = await db.query.vehicleDocuments.findFirst({
      where: and(
        eq(vehicleDocuments.vehicleId, vehicleId),
        eq(vehicleDocuments.documentTypeId, docTypeId),
      ),
    });

    if (existing) {
      await db
        .update(vehicleDocuments)
        .set({
          fechaDeInicio: inicio,
          fechaDeFin: fin,
          estado,
          updatedAt: new Date(),
        })
        .where(eq(vehicleDocuments.id, existing.id));
      actualizados++;
    } else {
      await db.insert(vehicleDocuments).values({
        vehicleId,
        documentTypeId: docTypeId,
        fechaDeInicio: inicio,
        fechaDeFin: fin,
        estado,
      });
      insertados++;
    }
  }

  // 3. Insertar SOAT
  console.log("📋 Insertando SOAT...");
  for (const item of soatData) {
    const vehicleId = vehicleByPlaca.get(item.placa);
    if (!vehicleId) {
      noEncontrados.push(`SOAT: ${item.placa}`);
      continue;
    }
    await upsert(vehicleId, soatType.id, item.inicio, item.fin);
    const estado = calcEstado(item.fin);
    console.log(`  ${item.placa} → ${estado} (vence ${item.fin})`);
  }

  // 4. Insertar Revisión Técnica
  console.log("\n📋 Insertando Revisión Técnica...");
  for (const item of rtData) {
    const vehicleId = vehicleByPlaca.get(item.placa);
    if (!vehicleId) {
      noEncontrados.push(`RT: ${item.placa}`);
      continue;
    }
    await upsert(vehicleId, rtType.id, item.inicio, item.fin);
    const estado = calcEstado(item.fin);
    console.log(`  ${item.placa} → ${estado} (vence ${item.fin})`);
  }

  // 5. Resumen
  console.log("\n─────────────────────────────────────");
  console.log(`✅ Insertados: ${insertados}`);
  console.log(`🔄 Actualizados: ${actualizados}`);
  if (noEncontrados.length > 0) {
    console.warn(`⚠️  Placas no encontradas en DB:`);
    noEncontrados.forEach((p) => console.warn(`   - ${p}`));
  }
  console.log("─────────────────────────────────────");
  console.log("🎉 Seed completado!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
