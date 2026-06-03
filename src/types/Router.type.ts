import { LucideIcon } from "lucide-react";

export interface RouteItem {
  title: string;
  url: string;
  icon?: LucideIcon; 
}

export interface Route {
  title: string;
  items: RouteItem[];
}