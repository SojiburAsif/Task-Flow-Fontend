"use client";

import React from "react";
import { ArrowLeft, Briefcase, Calendar as CalendarIcon, UserPlus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Role } from "@/app/constants/role";
import { updateProjectAction } from "@/services/project.actions";
import { type ProjectRecord } from "@/services/project.service";
import type { UserProfile } from "@/services/user.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  project: ProjectRecord;
  users: UserProfile[];
  mode?: "page" | "modal";
  returnHref?: string;
  onCloseHref?: string;
  onCancel?: () => void;
};

const normalizeRole = (role: string) => role.replace(/[_\s-]+/g, "").toLowerCase();

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const getStatusColor = (status: string | null | undefined) => {
  const s = (status || "").toLowerCase();
  if (s === "completed") return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
  if (s === "active") return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
  return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
};

export function ProjectEditForm({ project, users, mode = "page", returnHref = "/dashboard/projects", onCloseHref = `/dashboard/projects/${project.id}`, onCancel }: Props) {
  const isModal = mode === "modal";
  const teamMembers = users.filter((user) => normalizeRole(user.role) === Role.TeamMember.toLowerCase());
  const assignedMemberIds = new Set(project.members?.map((member) => member.id) ?? []);
  const shellWidth = isModal ? "max-w-none" : "max-w-6xl";
  const shellRadius = isModal ? "rounded-none" : "rounded-4xl";
  const shellPadding = isModal ? "px-6 py-5" : "px-6 py-6 sm:px-8 sm:py-6";
  const contentPadding = isModal ? "p-6" : "p-6 sm:p-8";
  const formColumns = isModal ? "lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]" : "lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.95fr)]";
  const sectionSpacing = isModal ? "space-y-4" : "space-y-6";

  const router = useRouter();

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget as HTMLFormElement;
    const fd = new FormData(formEl);

    const name = fd.get("name")?.toString() ?? "";
    const description = fd.get("description")?.toString() ?? "";
    const deadline = fd.get("deadline")?.toString() ?? undefined;
    const status = fd.get("status")?.toString() ?? undefined;
    const memberIds: string[] = [];
    for (const [k, v] of fd.entries()) {
      if (k.toString().startsWith("member-") && v === "on") {
        memberIds.push(k.toString().replace("member-", ""));
      }
    }

    const payload: Record<string, unknown> = {
      name: name.trim(),
      description: description.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      status: status || null,
      memberIds: memberIds.length > 0 ? memberIds : undefined,
    };

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin",
      });

      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Failed to update project");
      }

      toast.success("Project updated");
      if (onCancel) onCancel();
      router.push(returnHref || "/dashboard/projects");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err ?? "Unknown error");
      toast.error(msg || "Save failed");
    }
  };

  return (
    <div className={`relative min-h-[calc(100vh-2rem)] overflow-hidden ${isModal ? "px-4 py-4 sm:px-6" : "px-4 py-6 sm:px-6 lg:px-8"}`}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28%),linear-gradient(180deg,rgba(250,250,250,0.98),rgba(244,244,245,0.95))] dark:bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28%),linear-gradient(180deg,rgba(9,9,11,0.98),rgba(24,24,27,0.96))]" />

      <div className={`mx-auto flex min-h-[calc(100vh-3rem)] ${shellWidth} items-center justify-center`}>
        <div className={`relative w-full overflow-hidden ${shellRadius} border border-white/70 bg-white/95 shadow-[0_30px_120px_rgba(24,24,27,0.18)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 dark:shadow-[0_30px_120px_rgba(0,0,0,0.45)]`}>
          <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-purple-500 via-indigo-500 to-cyan-400" />

          {!isModal && (
            <div className={`flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 ${shellPadding}`}>
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                  <Briefcase size={24} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <ArrowLeft size={16} />
                    <a href={returnHref} className="hover:text-purple-600 transition-colors">
                      Back to project
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                      Edit Project
                    </h1>
                    <Badge className={getStatusColor(project.status)} variant="outline">
                      {project.status || "N/A"}
                    </Badge>
                  </div>
                  <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
                    Update project details and assigned team members in one place.
                  </p>
                </div>
              </div>

              <a
                href={onCloseHref}
                aria-label="Close edit modal"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              >
                <X size={18} />
              </a>
            </div>
          )}

          <form
            onSubmit={isModal ? handleModalSubmit : undefined}
            action={!isModal ? updateProjectAction : undefined}
            className={`grid grid-cols-1 gap-4 ${contentPadding} ${formColumns} ${isModal ? "lg:gap-5" : "lg:gap-8"}`}
          >
            <input type="hidden" name="id" value={project.id} />
            <input type="hidden" name="returnTo" value={returnHref} />

            <div className={sectionSpacing}>
              <Card className="overflow-hidden border-zinc-200/70 shadow-sm dark:border-zinc-800">
                <CardHeader className="border-b border-zinc-100 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <CardTitle className="text-lg">Project Information</CardTitle>
                  <CardDescription>Update the core project details.</CardDescription>
                </CardHeader>
                <CardContent className={`space-y-5 ${isModal ? "p-4 sm:p-5" : "p-6"}`}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input id="name" name="name" defaultValue={project.name} required className="h-11 rounded-xl focus:ring-purple-500" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" defaultValue={project.description ?? ""} rows={isModal ? 5 : 7} required className="min-h-45 rounded-2xl" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <div className="relative">
                        <Input id="deadline" name="deadline" type="date" defaultValue={toDateInputValue(project.deadline)} required className="h-11 rounded-xl pl-10" />
                        <CalendarIcon className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Project Status</Label>
                      <select id="status" name="status" defaultValue={project.status ?? "Active"} className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950">
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="OnHold">On Hold</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className={sectionSpacing}>
              <Card className="overflow-hidden border-zinc-200/70 shadow-sm dark:border-zinc-800">
                <CardHeader className="border-b border-zinc-100 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserPlus size={18} className="text-purple-500" />
                    Assign Members
                  </CardTitle>
                  <CardDescription>Select team members for this project.</CardDescription>
                </CardHeader>
                <CardContent className={isModal ? "p-4 sm:p-5" : "p-6"}>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {teamMembers.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-8 text-center text-sm text-zinc-500 italic dark:border-zinc-800 dark:bg-zinc-900/30">
                        No team members found in the system.
                      </div>
                    ) : (
                      teamMembers.map((user) => (
                        <label key={user.id} className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:hover:border-purple-500/30">
                          <input type="checkbox" name={`member-${user.id}`} defaultChecked={assignedMemberIds.has(user.id)} className="h-4 w-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">{user.name || "Unnamed User"}</p>
                            <p className="truncate text-[10px] font-medium uppercase text-zinc-500">{user.role}</p>
                          </div>
                          <Badge variant="outline" className="h-5 px-1.5 text-[8px]">{user.status}</Badge>
                        </label>
                      ))
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <Button type="submit" className="h-12 flex-1 rounded-2xl bg-purple-600 font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-200 dark:shadow-none">
                      Save Changes
                    </Button>
                    <a href={onCloseHref} className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100">
                      Cancel
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}