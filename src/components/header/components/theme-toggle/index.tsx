"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ReactSVG } from "react-svg";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  //This useEffect is to fix this: Warning: Prop `className` did not match. Server:
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <button
        className={`text-2xl cursor-pointer text-gray-500  ${
          theme == "dark" ? "hidden" : "block"
        }`}
        onClick={() => {
          setTheme("dark");
        }}
      >
        <ReactSVG src="/icons/moon.svg" className="[&_svg]:w-8" />
      </button>
      <button
        className={`text-2xl cursor-pointer text-orange-300 ${
          theme == "dark" ? "block" : "hidden"
        }`}
        onClick={() => {
          setTheme("light");
        }}
      >
        <ReactSVG src="/icons/sun.svg" className="[&_svg]:w-8 [&_svg]:fill-yellow-500" />
      </button>
    </>
  );
}
