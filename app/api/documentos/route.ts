import { NextResponse } from "next/server";
import { db } from "@/app/db";
import { vehicleDocuments } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const { vehicleId, nombre, archivoUrl } = await req.json();

  // ⚠️ OJO: necesitas el documentTypeId, no el nombre directamente
  // porque tu tabla usa documentTypeId, no "nombre"

  // 1. Buscar el tipo de documento
  const docType = await db.query.documentTypes.findFirst({
    where: (t, { eq }) => eq(t.nombre, nombre),
  });

  if (!docType) {
    return NextResponse.json({ error: "Tipo de documento no encontrado" });
  }

  // 2. Actualizar el documento
  await db
    .update(vehicleDocuments)
    .set({ archivoUrl })
    .where(
      and(
        eq(vehicleDocuments.vehicleId, vehicleId),
        eq(vehicleDocuments.documentTypeId, docType.id),
      ),
    );

  return NextResponse.json({ ok: true });
}
