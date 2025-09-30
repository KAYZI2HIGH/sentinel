import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Header = () => {
  return (
    <header
      className="
        flex justify-between items-center
        w-full max-w-7xl mx-auto
        px-4 sm:px-6 md:px-10 lg:px-16 py-4
      "
    >
      {/* Logo */}
      <div className="flex items-center justify-center gap-2">
        <div className="relative size-[55px]">
          <Image
            src={"/logo.png"}
            alt="Logo"
            fill
          />
        </div>
        <div
          className="
            font-semibold
            text-xl sm:text-2xl
            bg-gradient-to-r from-white to-gray-300
            bg-clip-text text-transparent
            tracking-tight
          "
        >
          Sentinel
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        <a
          href="#features"
          className="text-gray-400 hover:text-gray-200 font-medium text-sm transition-colors"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="text-gray-400 hover:text-gray-200 font-medium text-sm transition-colors"
        >
          How It Works
        </a>
        <a
          href="#api"
          className="text-gray-400 hover:text-gray-200 font-medium text-sm transition-colors"
        >
          API
        </a>
        <a
          href="#about"
          className="text-gray-400 hover:text-gray-200 font-medium text-sm transition-colors"
        >
          About
        </a>
      </nav>

      {/* CTA Button */}
      <div className="flex items-center gap-4">
        {/* Hide 'Live Demo' on mobile */}
        <a
          href="#demo"
          className="
            hidden sm:block
            text-gray-400 hover:text-gray-200
            font-medium text-sm transition-colors
          "
        >
          Live Demo
        </a>
        <Button
          className="
            bg-gradient-to-r from-violet-600 to-indigo-600
            hover:from-violet-700 hover:to-indigo-700
            text-white text-sm sm:text-base
            font-medium py-2 px-4 sm:px-6
            rounded-full transition-all duration-200
            shadow-md hover:shadow-xl
          "
        >
          Start Scanning
        </Button>
      </div>
    </header>
  );
};
