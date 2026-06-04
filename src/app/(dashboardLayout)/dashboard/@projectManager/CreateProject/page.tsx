/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { redirect } from "next/navigation";
import { createProject } from "@/services/project.service";
import { getUsers } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/app/constants/role";
import { UserPlus, Briefcase, Calendar as CalendarIcon } from "lucide-react";

export const createProjectAction = async (formData: FormData) => {
  'use server';
  const name = formData.get("name")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const deadline = formData.get("deadline")?.toString() ?? undefined;
  const status = formData.get("status")?.toString() ?? undefined;
  
  // Get all keys starting with member-
  const memberIds: string[] = [];
  for (const [key, value] of (formData as any).entries()) {
    if (key.startsWith("member-") && value === "on") {
      memberIds.push(key.replace("member-", ""));
    }
  }

  if (!name.trim() || !description.trim() || !deadline) {
    throw new Error("Please provide project name, description and a valid deadline.");
  }

  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Deadline must be a valid date.");
  }

  try {
    await createProject({ 
      name: name.trim(), 
      description: description.trim(), 
      deadline: d.toISOString(), 
      status: status || null, 
      memberIds: memberIds.length > 0 ? memberIds : undefined 
    });
  } catch (error: any) {
    console.error("Failed to create project:", error.message);
    throw error;
  }
  
  redirect("/dashboard/projects");
};

export default async function CreateProjectPage() {
  const users = await getUsers();
  const teamMembers = (users ?? []).filter((user) => {
    const normalizedRole = user.role.replace(/[_\s-]+/g, "").toLowerCase();
    return normalizedRole === Role.TeamMember.toLowerCase();
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
          <Briefcase size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create New Project
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Define project scope, set deadlines and assign team members.
          </p>
        </div>
      </div>

      <form action={createProjectAction}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Project Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-zinc-200/60 dark:border-zinc-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Project Information</CardTitle>
                <CardDescription>Basic details about the project goals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="e.g. Website Redesign" 
                    required 
                    className="focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Describe the project objectives and scope..." 
                    rows={6} 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <div className="relative">
                      <Input 
                        id="deadline" 
                        name="deadline" 
                        type="date" 
                        required 
                        className="pl-10"
                      />
                      <CalendarIcon className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Initial Status</Label>
                    <select 
                      id="status" 
                      name="status" 
                      className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="OnHold">On Hold</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Member Assignment */}
          <div className="space-y-6">
            <Card className="border-zinc-200/60 dark:border-zinc-800 shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus size={18} className="text-purple-500" />
                  Assign Members
                </CardTitle>
                <CardDescription>Select team members for this project.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                  {teamMembers.length === 0 ? (
                    <div className="text-sm text-zinc-500 italic text-center py-4">
                      No team members found in the system.
                    </div>
                  ) : (
                    teamMembers.map(user => (
                      <label 
                        key={user.id} 
                        className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                      >
                        <input 
                          type="checkbox" 
                          name={`member-${user.id}`} 
                          className="h-4 w-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {user.name || "Unnamed User"}
                          </p>
                          <p className="text-[10px] text-zinc-500 truncate uppercase font-medium">
                            {user.role}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[8px] px-1 py-0 h-4">
                          {user.status}
                        </Badge>
                      </label>
                    ))
                  )}
                </div>

                <div className="mt-8">
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-purple-200 dark:shadow-none transition-all hover:scale-[1.02]"
                  >
                    Create Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
