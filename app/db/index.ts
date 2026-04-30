import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// 👇 IMPORTA TODO TU SCHEMA
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);

// 👇 AQUÍ ESTÁ LA CLAVE
export const db = drizzle(sql, { schema });
