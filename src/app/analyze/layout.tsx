import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom-ui/AppSidebar";
import { Button } from "@/components/ui/button";
import { Github, Globe, Plus, RefreshCw, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { GradientBackgrounds } from "@/components/ui/hero-1";
import AnalyticsHeader from "@/components/custom-ui/AnalyticsHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen flex flex-col relative overflow-x-hidden">
        <GradientBackgrounds />
        <AnalyticsHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
