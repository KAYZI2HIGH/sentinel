import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-6 px-16 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="font-semibold text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Sentinel
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-8">
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

      <div className="flex items-center gap-4">
        <a
          href="#demo"
          className="hidden sm:block text-gray-400 hover:text-gray-200 font-medium text-sm transition-colors"
        >
          Live Demo
        </a>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
          Start Scanning
        </Button>
      </div>
    </header>
  );
};
