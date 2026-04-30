import "dotenv/config";

import { db } from "../db";
import { documentTypes } from "../db/schema";
async function main() {
  await db.insert(documentTypes).values([
    {
      nombre: "SOAT",
    },
    {
      nombre: "REVISION TECNICA",
    },
    {
      nombre: "TARJETA DE PROPIEDAD",
    },
    {
      nombre: "TARJETA UNICA DE CIRCULACION",
    },
    {
      nombre: "DOCUMENTACION DE COMPRA",
    },
  ]);

  console.log("Datos insertados 🚀");
}

main();
