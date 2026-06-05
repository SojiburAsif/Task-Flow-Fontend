import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  History,
  Settings 
} from "lucide-react";

export const TeamMemberRouters = [
  {
    title: "Overview",
    items: [
      {
        title: "My Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "My Workspace",
    items: [
      {
        title: "Assigned Projects",
        url: "/dashboard/my-projects",
        icon: Briefcase,
      },
      {
        title: "My Tasks Board",
        url: "/dashboard/my-tasks",
        icon: CheckSquare,
      },
      {
        title: "Activity Feed",
        url: "/dashboard/activities",
        icon: History,
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        title: "Profile Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];