"use client";
import React from "react";
import ThemeToggle from "./components/theme-toggle";
import SettingsModal from "./components/settings-modal";

export default function Header() {
  return (
    <header className="shadow-md z-10 dark:bg-dark-800 absolute top-0 left-0 right-0">
      <div className="container h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Chess Analysis</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SettingsModal />
        </div>
      </div>
    </header>
  );
}
