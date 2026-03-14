"use client";
import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="shadow-md z-10 dark:bg-dark-800">
      <div className="container h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span>Chess Analysis</span>
        </div>

        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
