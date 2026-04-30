import "dotenv/config";

import { db } from "../db";
import { documentTypes, vehicleDocuments, vehicles } from "../db/schema";

async function main() {
  console.log("🚀 Insertando vehicleDocuments...");

  const docs = await db.select().from(documentTypes);
  const vehicle = await db.select().from(vehicles).limit(1);

  if (!docs.length) throw new Error("No documentTypes");
  if (!vehicle.length) throw new Error("No vehicles");

  const vehicleId = vehicle[0].id;

  const getDocId = (name: string) => docs.find((d) => d.nombre === name)?.id;

  await db.insert(vehicleDocuments).values([
    {
      vehicle_id: vehicleId,
      document_type_id: getDocId("SOAT")!,
      archivo_url: "public/soat.pdf",
      fecha: new Date().toISOString().split("T")[0],
    },
  ]);

  console.log("🔥 Insert correcto");
}

main();
