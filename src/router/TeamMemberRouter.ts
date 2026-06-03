import { Route } from "@/types/Router.type";
import {
    CalendarCheck,
    ClipboardList,
    CreditCard,
    Home,
    Settings,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    UserCog,
    Users,
    UserSquare2,
    Bell,
} from "lucide-react";

export const TeamMemberRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
            { title: "My Tasks", url: "/dashboard/my-tasks", icon: ClipboardList },
            { title: "Team Tasks", url: "/dashboard/team-tasks", icon: Users },
            { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
        ],
    }
]