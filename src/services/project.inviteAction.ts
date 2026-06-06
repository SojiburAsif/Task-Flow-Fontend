"use server";

import { revalidatePath } from "next/cache";
import { getUsers } from "@/services/user.service";
import { getProjectById, updateProject } from "@/services/project.service";

type ActionState = {
  success: boolean;
  message: string;
};

const readFormValue = (formData: FormData, key: string) => {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
};

const revalidateProjectViews = (id: string, returnTo?: string | null) => {
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/AdminProjects");
  revalidatePath("/dashboard/@projectManager/projects");
  revalidatePath(`/dashboard/projects/${id}`);
  revalidatePath(`/dashboard/projects/${id}/edit`);
  if (returnTo?.startsWith("/dashboard")) revalidatePath(returnTo);
};

export const inviteMemberAction = async (prevState: ActionState = { success: false, message: "" }, formData?: FormData) => {
  void prevState;
  if (!formData) return { success: false, message: "No form data provided." } as ActionState;

  const projectId = readFormValue(formData, "projectId");
  const email = readFormValue(formData, "email");
  const returnTo = readFormValue(formData, "returnTo") || null;

  if (!projectId || !email) return { success: false, message: "Project ID and email are required." } as ActionState;

  try {
    const users = await getUsers();
    if (!users || users.length === 0) return { success: false, message: "No users found in the system." } as ActionState;

    const found = users.find(u => (u.email || "").toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, message: `No user with email ${email} found. Ask them to register first.` } as ActionState;

    const project = await getProjectById(projectId);
    const existing = project?.members?.map(m => m.id) ?? [];
    if (existing.includes(found.id)) return { success: false, message: "User is already a member of this project." } as ActionState;

    await updateProject(projectId, { memberIds: [...existing, found.id] });
    revalidateProjectViews(projectId, returnTo);

    return { success: true, message: `Invited ${found.email} to project.` } as ActionState;
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to invite member." } as ActionState;
  }
};
