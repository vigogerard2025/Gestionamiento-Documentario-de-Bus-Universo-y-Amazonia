import "dotenv/config";

import { db } from "../db";
import { revision_tecnica, vehicles } from "../db/schema";
import { eq } from "drizzle-orm";

// Helper: busca vehicle_id por placa
async function getVehicleId(placa: string): Promise<number | null> {
  const v = await db.query.vehicles.findFirst({
    where: eq(vehicles.placa, placa),
  });
  return v?.id ?? null;
}

async function main() {
  console.log("🚀 Insertando Revisión Técnica...");

  // ─────────────────────────────────────────────
  // AMAZONIA TOURS
  // Nota: camiones JAC (TFM-869, TFP-846, TFM-919, TFM-884,
  //        TFM-912, TFM-937, TFM-924, TFM-813) sin RT aún
  // ─────────────────────────────────────────────
  const amazoniaRT: {
    placa: string;
    inicio: string;
    fin: string;
    estado: string;
  }[] = [
    {
      placa: "AKW-788",
      inicio: "2025-08-02",
      fin: "2026-08-02",
      estado: "Vigente",
    },
    {
      placa: "D1M-825",
      inicio: "2025-12-22",
      fin: "2026-12-27",
      estado: "Vigente",
    },
    {
      placa: "T8C-855",
      inicio: "2025-09-01",
      fin: "2026-09-01",
      estado: "Vigente",
    },
    {
      placa: "P4M-783",
      inicio: "2026-05-10",
      fin: "2027-05-10",
      estado: "Vigente",
    },
  ];

  // ─────────────────────────────────────────────
  // TURISMO BUS UNIVERSO
  // Nota: camiones HYUNDAI EX8 (TFL/TFM-*) sin RT aún
  // ─────────────────────────────────────────────
  const universoRT: {
    placa: string;
    inicio: string;
    fin: string;
    estado: string;
  }[] = [
    {
      placa: "B4H955",
      inicio: "2026-01-19",
      fin: "2026-05-19",
      estado: "Por vencer",
    },
    {
      placa: "T2H961",
      inicio: "2026-01-08",
      fin: "2026-07-08",
      estado: "Vigente",
    },
    {
      placa: "A1O964",
      inicio: "2025-12-13",
      fin: "2026-06-13",
      estado: "Vigente",
    },
    {
      placa: "T3C967",
      inicio: "2026-03-31",
      fin: "2026-09-30",
      estado: "Vigente",
    },
    {
      placa: "F1U967",
      inicio: "2026-02-09",
      fin: "2026-08-09",
      estado: "Vigente",
    },
    {
      placa: "T5N953",
      inicio: "2025-11-25",
      fin: "2026-05-25",
      estado: "Por vencer",
    },
    {
      placa: "C2M964",
      inicio: "2025-12-26",
      fin: "2026-06-26",
      estado: "Vigente",
    },
    {
      placa: "C9I955",
      inicio: "2025-11-25",
      fin: "2026-05-25",
      estado: "Por vencer",
    },
    {
      placa: "D3N950",
      inicio: "2025-12-08",
      fin: "2026-06-08",
      estado: "Vigente",
    },
    {
      placa: "T1F968",
      inicio: "2026-02-14",
      fin: "2026-08-14",
      estado: "Vigente",
    },
    {
      placa: "T3Q962",
      inicio: "2025-12-08",
      fin: "2026-06-08",
      estado: "Vigente",
    },
    {
      placa: "D1B952",
      inicio: "2026-03-30",
      fin: "2026-09-30",
      estado: "Vigente",
    },
    {
      placa: "B7C965",
      inicio: "2025-12-10",
      fin: "2026-06-10",
      estado: "Vigente",
    },
    {
      placa: "D5Y-957",
      inicio: "2025-12-08",
      fin: "2026-06-08",
      estado: "Vigente",
    },
  ];

  const allRT = [...amazoniaRT, ...universoRT];

  let insertados = 0;
  let noEncontrados: string[] = [];

  for (const item of allRT) {
    const vehicleId = await getVehicleId(item.placa);
    if (!vehicleId) {
      noEncontrados.push(item.placa);
      continue;
    }

    await db.insert(revision_tecnica).values({
      vehicle_id: vehicleId,
      fecha_de_inicio: item.inicio,
      fecha_de_fin: item.fin,
      estado: item.estado,
    });
    insertados++;
  }

  console.log(`✅ Revisiones Técnicas insertadas: ${insertados}`);
  if (noEncontrados.length > 0) {
    console.warn(
      `⚠️  Placas no encontradas en DB: ${noEncontrados.join(", ")}`,
    );
  }
}

main();
