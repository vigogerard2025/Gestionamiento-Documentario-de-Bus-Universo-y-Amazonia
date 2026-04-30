"use server";
import { db } from "@/app/db";
import { vehicles } from "@/app/db/schema";
import { revalidatePath } from "next/cache";

export async function createVehicle(data: typeof vehicles.$inferInsert) {
  await db.insert(vehicles).values(data);
  revalidatePath("/vehicles");
}
