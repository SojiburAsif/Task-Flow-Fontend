import { 
  LayoutDashboard, 
  FolderGit2, 
  ListTodo, 
  Users2, 
  History, 
  Settings 
} from "lucide-react";

export const AdminRouters = [
  {
    title: "Overview",
    items: [
      {
        title: "Global Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "All Projects",
        url: "/dashboard/AdminProjects",
        icon: FolderGit2,
      },
      {
        title: "All Tasks",
        url: "/dashboard/AdminTasks",
        icon: ListTodo,
      },
      {
        title: "Manage Members",
        url: "/dashboard/members",
        icon: Users2,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Activity Logs",
        url: "/dashboard/AdminActivities",
        icon: History,
      },
      {
        title: "Settings",
        url: "/dashboard/AdminSettings",
        icon: Settings,
      },
    ],
  },
];