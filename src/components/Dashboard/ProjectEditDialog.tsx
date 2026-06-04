"use client";

import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ProjectEditForm } from "@/components/Dashboard/ProjectEditForm";
import type { ProjectRecord } from "@/services/project.service";
import type { UserProfile } from "@/services/user.service";

type Props = {
  project: ProjectRecord;
  users: UserProfile[];
  trigger: React.ReactNode;
};

export function ProjectEditDialog({ project, users, trigger }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-0 sm:max-w-[calc(100vw-2rem)] lg:max-w-6xl">
        <DialogHeader className="border-b border-zinc-100 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40">
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project details and assigned team members.</DialogDescription>
        </DialogHeader>

        <ProjectEditForm project={project} users={users} mode="modal" returnHref="/dashboard/projects" onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default ProjectEditDialog;
