"use client";
import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <header className="flex h-14 items-center gap-2 px-4 shadow-lg border-b border-b-zinc-200">
      <SidebarTrigger />
      <div>Chess Analysis</div>
    </header>
  );
}
