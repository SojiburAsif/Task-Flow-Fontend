import React from "react";
import { notFound } from "next/navigation";

import { getProjects } from "@/services/project.service";
import { getUsers } from "@/services/user.service";
import { ProjectEditForm } from "@/components/Dashboard/ProjectEditForm";

type Props = { params: { id: string } };

export default async function EditProjectPage({ params }: Props) {
  const resolved = await Promise.resolve(params);
  const projects = await getProjects();
  const project = projects?.find((item) => item.id === resolved.id) ?? null;

  if (!project) {
    notFound();
  }

  const users = await getUsers();

  return <ProjectEditForm project={project} users={users ?? []} />;
}