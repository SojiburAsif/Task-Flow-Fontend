import React from "react";
import { getProjects, updateProject } from "@/services/project.service";
import { revalidatePath } from "next/cache";
import { Calendar, User, Users, CheckCircle2, AlertCircle, ArrowLeft, Edit2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { params: { id: string } };

async function handleStatusUpdate(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString();
  const status = formData.get('status')?.toString() || undefined;
  if (!id) return;
  await updateProject(id, { status: status || undefined });
  revalidatePath(`/dashboard/projects/${id}`);
  revalidatePath('/dashboard/projects');
}

const getStatusColor = (status: string | null | undefined) => {
  const s = (status || "").toLowerCase();
  if (s === "completed") return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
  if (s === "active") return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
  return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
};

export default async function ProjectDetailsPage({ params }: Props) {
  const projects = await getProjects();
  const resolved = (await Promise.resolve(params)) as { id: string };
  const project = projects?.find(p => p.id === resolved.id) ?? null;

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <AlertCircle size={48} className="text-red-500 opacity-50" />
        <h2 className="text-xl font-bold">Project Not Found</h2>
        <Link href="/dashboard/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="space-y-4">
          <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-purple-600 transition-colors">
            <ArrowLeft size={16} />
            Back to All Projects
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase italic">
                {project.name}
              </h1>
              <Badge className={getStatusColor(project.status)}>
                {project.status || "N/A"}
              </Badge>
            </div>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3 text-sm">
            <User size={16} className="text-purple-500" />
            <span className="text-zinc-500">Project Owner:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{project.createdBy?.name ?? 'System'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-purple-500" />
            <span className="text-zinc-500">Deadline:</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No deadline'}
            </span>
          </div>
          <div className="pt-2">
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <Button className="w-full gap-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
                <Edit2 size={16} />
                Edit Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Members Section */}
        <Card className="lg:col-span-2 border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users size={18} className="text-purple-500" />
              Team Members
            </CardTitle>
            <CardDescription>People assigned to this project.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {project.members && project.members.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {project.members.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-bold text-purple-600">
                        {(m.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{m.name ?? 'Unnamed User'}</p>
                        <p className="text-xs text-zinc-500 italic">User ID: {m.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 italic">
                No members assigned to this project yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Settings */}
        <div className="space-y-6">
          <Card className="border-zinc-200/60 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-lg">Project Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form action={handleStatusUpdate} className="space-y-4">
                <input type="hidden" name="id" value={project.id} />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Change Progress</label>
                  <select 
                    name="status" 
                    defaultValue={project.status ?? ""} 
                    className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="OnHold">On Hold</option>
                  </select>
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl transition-all">
                  Update Status
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-purple-200 dark:shadow-none">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-lg italic">
              <CheckCircle2 size={20} />
              Next Milestones
            </h4>
            <p className="text-sm text-indigo-50 leading-relaxed mb-4">
              Keep your team updated with the latest project progress.
            </p>
            <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 border-none text-white font-bold backdrop-blur-sm">
              Manage Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
