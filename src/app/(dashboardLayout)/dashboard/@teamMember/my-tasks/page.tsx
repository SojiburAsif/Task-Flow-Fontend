import React from "react";

import { getCurrentUser } from "../../../../../lib/currentUser";
import { getMyTasks, getTasks } from "../../../../../services/task.service";
import { TaskBoard } from "../../../../../components/Dashboard/TaskBoard";

export default async function MyTaskPage() {
  const [myTasks, fallbackTasks, user] = await Promise.all([
    getMyTasks({ sortBy: "priority", order: "asc" }),
    getTasks({ sortBy: "priority", order: "asc" }),
    getCurrentUser(),
  ]);
  const tasks = myTasks ?? fallbackTasks ?? [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TaskBoard
        tasks={tasks}
        title="My Tasks"
        description="Work through your assigned tasks, update progress, and keep delivery moving without leaving the dashboard."
        roleLabel={user?.role ? `${user.role} panel` : "Team member workspace"}
        currentUser={user}
        returnTo="/dashboard/my-tasks"
        statusEditable
        allowAssignmentEdit={false}
        allowTaskEdit={false}
        canCreateTask={false}
      />
    </div>
  );
}
