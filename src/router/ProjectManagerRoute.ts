import { 
  LayoutDashboard, 
  FolderGit2, 
  ListTodo, 
  Users, 
  History, 
  Settings 
} from "lucide-react";

export const ProjectManagerRouters = [
  {
    title: "Overview",
    items: [
      {
        title: "Manager Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Workspaces",
    items: [
      {
        title: "My Projects",
        url: "/dashboard/projects",
        icon: FolderGit2,
      },
      {
        title: "Task Management",
        url: "/dashboard/tasks",
        icon: ListTodo,
      },
      {
        title: "Create New Project",
        url: "/dashboard/CreateProject",
        icon: FolderGit2,
      },
      {
        title: "My Project Teams",
        url: "/dashboard/teams",
        icon: Users,
      },
    ],
  },
  {
    title: "Audit & Config",
    items: [
      {
        title: "Project Logs",
        url: "/dashboard/activities",
        icon: History,
      },
      {
        title: "Account Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];