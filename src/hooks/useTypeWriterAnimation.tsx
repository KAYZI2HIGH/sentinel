'use client'
import { useEffect, useState } from "react";

export const useTypewriterPlaceholder = () => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const phrases = [
      "Paste token address to scan...",
      "Enter any Solana contract...",
      "Check NFT authenticity...",
      "Analyze token security...",
      "Verify before you invest...",
    ];

    let currentPhraseIndex = 0;
    let currentIndex = 0;
    let isDeleting = false;
    let waitBeforeDelete = false;

    const animate = () => {
      const currentPhrase = phrases[currentPhraseIndex];

      if (waitBeforeDelete) {
        setTimeout(() => {
          waitBeforeDelete = false;
          isDeleting = true;
          animate();
        }, 1500);
        return;
      }

      if (isDeleting) {
        if (currentIndex > 0) {
          setDisplayText(currentPhrase.substring(0, currentIndex - 1));
          currentIndex--;
          setTimeout(animate, 50);
        } else {
          isDeleting = false;
          currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
          setTimeout(animate, 500);
        }
      } else {
        if (currentIndex < currentPhrase.length) {
          setDisplayText(currentPhrase.substring(0, currentIndex + 1));
          currentIndex++;
          setTimeout(animate, 100);
        } else {
          waitBeforeDelete = true;
          setTimeout(animate, 1500);
        }
      }
    };

    animate();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return displayText;
};
