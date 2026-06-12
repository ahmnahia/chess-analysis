"use client";
import React from "react";
import ThemeToggle from "./components/theme-toggle";
import SettingsModal from "./components/settings-modal";
import { ReactSVG } from "react-svg";

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
          <a
            href="https://github.com/ahmnahia/chess-analysis"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ReactSVG
              src="/icons/github.svg"
              className="[&_svg]:w-8 [&_svg]:fill-zinc-950 [&_svg]:dark:fill-white"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
