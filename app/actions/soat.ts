import "dotenv/config";

import { db } from "../db";
import { soat, vehicles } from "../db/schema";
import { eq } from "drizzle-orm";

// Helper: busca vehicle_id por placa
async function getVehicleId(placa: string): Promise<number | null> {
  const v = await db.query.vehicles.findFirst({
    where: eq(vehicles.placa, placa),
  });
  return v?.id ?? null;
}

async function main() {
  console.log("🚀 Insertando SOAT...");

  // ─────────────────────────────────────────────
  // AMAZONIA TOURS
  // ─────────────────────────────────────────────
  const amazoniaSoat: {
    placa: string;
    inicio: string;
    fin: string;
    estado: string;
  }[] = [
    {
      placa: "AKW-788",
      inicio: "2025-03-22",
      fin: "2027-04-22",
      estado: "Vigente",
    },
    {
      placa: "D1M-825",
      inicio: "2025-01-15",
      fin: "2026-01-15",
      estado: "Vigente",
    },
    {
      placa: "T8C-855",
      inicio: "2025-08-28",
      fin: "2026-08-28",
      estado: "Vigente",
    },
    {
      placa: "TFM-869",
      inicio: "2025-09-22",
      fin: "2026-09-22",
      estado: "Vigente",
    },
    {
      placa: "TFP-846",
      inicio: "2025-10-08",
      fin: "2026-10-08",
      estado: "Vigente",
    },
    {
      placa: "TFM-919",
      inicio: "2025-09-22",
      fin: "2026-09-22",
      estado: "Vigente",
    },
    {
      placa: "TFM-884",
      inicio: "2025-09-22",
      fin: "2026-09-22",
      estado: "Vigente",
    },
    {
      placa: "TFM-912",
      inicio: "2025-09-22",
      fin: "2026-09-22",
      estado: "Vigente",
    },
    {
      placa: "TFM-937",
      inicio: "2025-09-22",
      fin: "2026-09-22",
      estado: "Vigente",
    },
    {
      placa: "TFM-924",
      inicio: "2025-09-22",
      fin: "2026-09-22",
      estado: "Vigente",
    },
    {
      placa: "TFM-813",
      inicio: "2025-09-22",
      fin: "2026-09-22",
      estado: "Vigente",
    },
    {
      placa: "P4M-783",
      inicio: "2025-12-10",
      fin: "2026-12-10",
      estado: "Vigente",
    },
  ];

  // ─────────────────────────────────────────────
  // TURISMO BUS UNIVERSO
  // ─────────────────────────────────────────────
  const universoSoat: {
    placa: string;
    inicio: string;
    fin: string;
    estado: string;
  }[] = [
    {
      placa: "B4H955",
      inicio: "2025-09-26",
      fin: "2026-09-26",
      estado: "Vigente",
    },
    {
      placa: "T2H961",
      inicio: "2025-09-26",
      fin: "2026-09-26",
      estado: "Vigente",
    },
    {
      placa: "A1O964",
      inicio: "2025-09-26",
      fin: "2026-09-26",
      estado: "Vigente",
    },
    {
      placa: "T3C967",
      inicio: "2025-08-26",
      fin: "2026-08-26",
      estado: "Vigente",
    },
    {
      placa: "F1U967",
      inicio: "2026-01-09",
      fin: "2026-09-26",
      estado: "Vigente",
    },
    {
      placa: "T5N953",
      inicio: "2025-08-29",
      fin: "2026-08-29",
      estado: "Vigente",
    },
    {
      placa: "C2M964",
      inicio: "2025-12-23",
      fin: "2026-09-26",
      estado: "Vigente",
    },
    {
      placa: "C9I955",
      inicio: "2026-02-18",
      fin: "2027-02-18",
      estado: "Vigente",
    },
    {
      placa: "D3N950",
      inicio: "2025-10-21",
      fin: "2026-10-21",
      estado: "Vigente",
    },
    {
      placa: "T1F968",
      inicio: "2026-02-13",
      fin: "2027-02-13",
      estado: "Vigente",
    },
    {
      placa: "T3Q962",
      inicio: "2025-09-26",
      fin: "2026-09-26",
      estado: "Vigente",
    },
    {
      placa: "D1B952",
      inicio: "2025-09-26",
      fin: "2026-09-26",
      estado: "Vigente",
    },
    {
      placa: "B7C965",
      inicio: "2025-09-26",
      fin: "2026-09-26",
      estado: "Vigente",
    },
    {
      placa: "D5Y-957",
      inicio: "2025-12-04",
      fin: "2026-12-04",
      estado: "Vigente",
    },
    {
      placa: "TFL-901",
      inicio: "2025-10-03",
      fin: "2026-10-03",
      estado: "Vigente",
    },
    {
      placa: "TFM-833",
      inicio: "2025-10-03",
      fin: "2026-10-03",
      estado: "Vigente",
    },
    {
      placa: "TFM-911",
      inicio: "2025-10-03",
      fin: "2026-10-03",
      estado: "Vigente",
    },
    {
      placa: "TFM-913",
      inicio: "2025-10-03",
      fin: "2026-10-03",
      estado: "Vigente",
    },
    {
      placa: "TFL-935",
      inicio: "2025-10-03",
      fin: "2026-10-03",
      estado: "Vigente",
    },
    {
      placa: "TFL-944",
      inicio: "2025-09-10",
      fin: "2026-09-10",
      estado: "Vigente",
    },
    {
      placa: "TFL-915",
      inicio: "2025-09-10",
      fin: "2026-09-10",
      estado: "Vigente",
    },
    {
      placa: "TFL-943",
      inicio: "2025-09-10",
      fin: "2026-09-10",
      estado: "Vigente",
    },
    {
      placa: "TFL-914",
      inicio: "2025-09-10",
      fin: "2026-09-10",
      estado: "Vigente",
    },
    {
      placa: "TFM-832",
      inicio: "2025-10-03",
      fin: "2026-10-03",
      estado: "Vigente",
    },
  ];

  const allSoat = [...amazoniaSoat, ...universoSoat];

  let insertados = 0;
  let noEncontrados: string[] = [];

  for (const item of allSoat) {
    const vehicleId = await getVehicleId(item.placa);
    if (!vehicleId) {
      noEncontrados.push(item.placa);
      continue;
    }

    await db.insert(soat).values({
      vehicle_id: vehicleId,
      fecha_de_inicio: item.inicio,
      fecha_de_fin: item.fin,
      estado: item.estado,
    });
    insertados++;
  }

  console.log(`✅ SOAT insertados: ${insertados}`);
  if (noEncontrados.length > 0) {
    console.warn(
      `⚠️  Placas no encontradas en DB: ${noEncontrados.join(", ")}`,
    );
  }
}

main();
