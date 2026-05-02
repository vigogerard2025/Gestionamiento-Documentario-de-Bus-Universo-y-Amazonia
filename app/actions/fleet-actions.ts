"use server";

import { db } from "@/app/db";
import { vehicles, vehicleDocuments } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { VehicleInsert, VehicleDocumentInsert } from "@/app/db/schema";

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export async function createVehicle(data: VehicleInsert) {
  await db.insert(vehicles).values(data);
  revalidatePath("/vehicles");
}

export async function updateVehicle(id: number, data: Partial<VehicleInsert>) {
  await db.update(vehicles).set(data).where(eq(vehicles.id, id));
  revalidatePath("/vehicles");
}

export async function deleteVehicle(id: number) {
  await db.delete(vehicles).where(eq(vehicles.id, id));
  revalidatePath("/vehicles");
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function upsertDocument(data: VehicleDocumentInsert) {
  // Si ya existe un doc del mismo tipo para ese vehículo, actualiza
  const existing = await db.query.vehicleDocuments.findFirst({
    where: (d, { and, eq }) =>
      and(
        eq(d.vehicleId, data.vehicleId!),
        eq(d.documentTypeId, data.documentTypeId!),
      ),
  });

  if (existing) {
    await db
      .update(vehicleDocuments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(vehicleDocuments.id, existing.id));
  } else {
    await db.insert(vehicleDocuments).values(data);
  }

  revalidatePath("/vehicles");
}

export async function deleteDocument(id: number) {
  await db.delete(vehicleDocuments).where(eq(vehicleDocuments.id, id));
  revalidatePath("/vehicles");
}

// ─── Upload PDF (Supabase Storage) ───────────────────────────────────────────
// Adapta según tu proveedor de storage. Este ejemplo usa Supabase.

export async function uploadDocumentPDF(
  vehicleId: number,
  documentTypeId: number,
  formData: FormData,
): Promise<{ url: string; nombre: string } | { error: string }> {
  const file = formData.get("file") as File | null;
  if (!file) return { error: "No se recibió archivo" };

  // Validar que sea PDF
  if (file.type !== "application/pdf") {
    return { error: "Solo se permiten archivos PDF" };
  }

  // Máximo 10MB
  if (file.size > 10 * 1024 * 1024) {
    return { error: "El archivo no puede superar 10MB" };
  }

  try {
    // ── Supabase Storage example ──────────────────────────────────────────
    // import { createClient } from "@supabase/supabase-js";
    // const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
    //
    // const fileName = `vehicle_${vehicleId}_doctype_${documentTypeId}_${Date.now()}.pdf`;
    // const { data, error } = await supabase.storage
    //   .from("vehicle-documents")
    //   .upload(fileName, file, { contentType: "application/pdf", upsert: true });
    //
    // if (error) return { error: error.message };
    //
    // const { data: { publicUrl } } = supabase.storage
    //   .from("vehicle-documents")
    //   .getPublicUrl(fileName);
    //
    // return { url: publicUrl, nombre: file.name };
    // ─────────────────────────────────────────────────────────────────────

    // Placeholder hasta conectar storage real:
    const fakeUrl = `/uploads/vehicle_${vehicleId}_${documentTypeId}.pdf`;
    return { url: fakeUrl, nombre: file.name };
  } catch (err) {
    return { error: "Error al subir el archivo" };
  }
}
