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

export const AdminRouters: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/dashboard", icon: Home },
            { title: "Create Provider", url: "/dashboard/create-provider", icon: Settings },
            { title: "All Users", url: "/dashboard/users", icon: Users },
            { title: "All Providers", url: "/dashboard/providers", icon: UserSquare2 },
            { title: "All Services", url: "/dashboard/services", icon: Stethoscope },
            { title: "All Bookings", url: "/dashboard/bookings", icon: CalendarCheck },
            { title: "Specialties", url: "/dashboard/specialties", icon: Sparkles },
            { title: "Payments", url: "/dashboard/payments", icon: CreditCard },
            { title: "Reviews & Ratings", url: "/dashboard/reviewsAdmin", icon: ClipboardList },
            { title: "Notifications", url: "/dashboard/admin-notifications", icon: Bell },
            { title: "Create Admin", url: "/dashboard/create-admin", icon: UserCog },
            { title: "All Admins", url: "/dashboard/AllAdmin", icon: UserCog }
        ],
    }
]