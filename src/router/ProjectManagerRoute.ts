import { Route } from "@/types/Router.type";
import { Home, Settings, Users } from "lucide-react";

export const ProjectManagerRouters: Route[] = [
    {
        title: "Manager Workspace",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
            { title: "Create Provider", url: "/dashboard/create-provider", icon: Settings },
            { title: "All Users", url: "/dashboard/users", icon: Users },
        ],
    }
];