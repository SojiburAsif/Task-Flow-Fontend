"use server";

import { updateUserByAdminAction, deleteUserByAdminAction } from "./user.actions";

export async function updateUserByAdminFormAction(formData: FormData): Promise<void> {
  await updateUserByAdminAction(formData);
}

export async function deleteUserByAdminFormAction(formData: FormData): Promise<void> {
  await deleteUserByAdminAction(formData);
}
