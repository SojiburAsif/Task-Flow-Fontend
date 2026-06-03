import { Route } from "@/types/Router.type";
import { ClipboardList, Home, Users, Bell } from "lucide-react";

export const TeamMemberRouters: Route[] = [
    {
        title: "Member Workspace",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
            { title: "My Tasks", url: "/dashboard/my-tasks", icon: ClipboardList },
            { title: "Team Tasks", url: "/dashboard/team-tasks", icon: Users },
            { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
        ],
    }
];