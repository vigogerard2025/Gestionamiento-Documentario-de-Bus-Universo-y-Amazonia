import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { vehicleDocuments, documentTypes } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const { vehicleId, nombre, archivoUrl } = await req.json();

  // 1. Buscar tipo de documento
  const docType = await db.query.documentTypes.findFirst({
    where: (t, { eq }) => eq(t.nombre, nombre),
  });

  if (!docType) {
    return NextResponse.json({ error: "Tipo de documento no encontrado" });
  }

  // 🔍 2. Verificar si ya existe el documento
  const existente = await db.query.vehicleDocuments.findFirst({
    where: (d, { eq, and }) =>
      and(eq(d.vehicleId, vehicleId), eq(d.documentTypeId, docType.id)),
  });

  if (existente) {
    // 🔄 UPDATE
    await db
      .update(vehicleDocuments)
      .set({ archivoUrl })
      .where(eq(vehicleDocuments.id, existente.id));
  } else {
    // ➕ INSERT (ESTO TE FALTABA)
    await db.insert(vehicleDocuments).values({
      vehicleId,
      documentTypeId: docType.id,
      archivoUrl,
    });
  }

  return NextResponse.json({ ok: true });
}
