"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  ChevronDown,
  Github,
  Globe,
  Plus,
  RefreshCw,
  Upload,
} from "lucide-react";
import { Input } from "../ui/input";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import Link from "next/link";

const AnalyticsHeader = () => {
  const { state } = useSidebar();
  return (
    <header className="w-full h-14 py-8 flex items-center justify-between px-4 text-white">
      {/* Left section */}
      <div className="flex items-center gap-2">
        {state === "collapsed" && (
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-xl sm:text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight flex items-center gap-1">
                Sentinel{" "}
                <ChevronDown
                  size={14}
                  className="text-white"
                />
              </div>
              <p className="text-xs text-white/70 mt-[2px]">
                Ask questions about this analysis
              </p>
            </div>
            <SidebarTrigger />
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="bg-[#1e1e2f] text-white border-white/20 hover:bg-white/10"
        >
          <Globe className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-transparent hover:bg-white/10"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-transparent hover:bg-white/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Middle section */}
      <div className="flex items-center gap-2 w-72">
        <Input
          placeholder="Search or navigate…"
          className="h-8 rounded-full bg-[#1e1e2f] border-white/20 text-white placeholder:text-gray-400"
        />
        <Button
          variant="ghost"
          size="icon"
          className="bg-transparent hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          className="bg-purple-600 text-white rounded-full px-3 hover:bg-purple-700"
        >
          Invite
        </Button>
        <Link href="https://github.com">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/10"
          >
            <Github className="h-5 w-5" />
          </Button>
        </Link>
        <Button
          size="sm"
          className="bg-blue-600 text-white rounded-full px-4 hover:bg-blue-700"
        >
          Publish
        </Button>
      </div>
    </header>
  );
};

export default AnalyticsHeader;
