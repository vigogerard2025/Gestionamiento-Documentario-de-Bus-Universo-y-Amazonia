// app/actions/documents.ts
"use server";

import { db } from "@/app/db";
import { vehicleDocuments } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export async function guardarDocumento(
  vehicleId: number,
  documentTypeId: number,
  url: string,
  nombre: string,
) {
  // 🔥 verificar si ya existe
  const existing = await db
    .select()
    .from(vehicleDocuments)
    .where(
      and(
        eq(vehicleDocuments.vehicleId, vehicleId),
        eq(vehicleDocuments.documentTypeId, documentTypeId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    // 🔄 UPDATE
    await db
      .update(vehicleDocuments)
      .set({
        archivoUrl: url,
        archivoNombre: nombre,
        updatedAt: new Date(),
      })
      .where(eq(vehicleDocuments.id, existing[0].id));
  } else {
    // 🆕 INSERT
    await db.insert(vehicleDocuments).values({
      vehicleId,
      documentTypeId,
      archivoUrl: url,
      archivoNombre: nombre,
    });
  }
}
