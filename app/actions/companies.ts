import "dotenv/config";

import { db } from "../db";
import { companies } from "../db/schema";

async function main() {
  await db.insert(companies).values([
    {
      nombre: "AMAZONIA TOURS",
      ruc: "20603635371",
    },
    {
      nombre: "TURISMO BUS UNIVERSO",
      ruc: "20600224124",
    },
  ]);

  console.log("Datos insertados 🚀");
}

main();
