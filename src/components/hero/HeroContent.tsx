import { SearchInterface } from "../custom-ui/SearchInterface";
import { WordRotate } from "../ui/word-rotate";
import { Button } from "@/components/ui/button";

interface HeroContentProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  adjustHeight: (reset?: boolean) => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
  textareaRef,
  adjustHeight,
}) => {
  const suggestionPills = [
    "Scan a Solana token address",
    "Check NFT contract safety",
    "Analyze liquidity pool health",
    "Verify token creator history",
    "Detect rug pull risks",
  ];

  return (
    <section className="flex-1 flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Headline */}
        <h1 className="text-5xl font-bold leading-tight flex items-center gap-3 w-fit mx-auto *:font-[var(--font-geist-mono)]">
          Your Solana
          <WordRotate
            words={["Security", "Trust", "Safety", "Analysis", "Protection"]}
          />
          Sidekick.
        </h1>

        {/* Subtitle */}
        <p className=" text-gray-300">
          Sentinel analyzes tokens, detects scams, and protects your portfolio
          with real-time AI security ratings.
        </p>

        {/* Search Interface */}
        <SearchInterface
          value={value}
          onChange={onChange}
          onSend={onSend}
          isLoading={isLoading}
          textareaRef={textareaRef}
          adjustHeight={adjustHeight}
        />

        {/* Suggestion pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-12 max-w-2xl mx-auto">
          {suggestionPills.map((pill, index) => (
            <Button
              key={index}
              variant="secondary"
              className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm text-white"
            >
              {pill}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
