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

export const ProjectManagerRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
            { title: "Create Provider", url: "/dashboard/create-provider", icon: Settings },
            { title: "All Users", url: "/dashboard/users", icon: Users },
        ],
    }
]