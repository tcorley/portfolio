import type { Route } from "./+types/mahjong";
import { useState, useEffect } from "react";
import {
  MAHJONG_2024_CATEGORIES,
  type PatternInk,
} from "../data/mahjong-2024-categories";
import {
  HandListFilterToggle,
  type HandListFilterMode,
} from "../components/hand-list-filter-toggle";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "American Mahjong Cards | Rolan Corley" },
    {
      name: "description",
      content: "View National Mah Jongg League (NMJL) winning hands by year",
    },
  ];
}

// Tile types for American Mahjong with suits
// Number tiles: B=Bams, C=Craks, D=Dots
// Honor tiles: no suits
type TileType =
  // Bams (Bamboos)
  "1B" | "2B" | "3B" | "4B" | "5B" | "6B" | "7B" | "8B" | "9B" | "0B" |
  // Craks (Characters)
  "1C" | "2C" | "3C" | "4C" | "5C" | "6C" | "7C" | "8C" | "9C" | "0C" |
  // Dots (Circles)
  "1D" | "2D" | "3D" | "4D" | "5D" | "6D" | "7D" | "8D" | "9D" | "0D" |
  // Honors (Winds, Dragons, Flowers)
  "N" | "E" | "W" | "S" | "D" | "F";

const TILE_LABELS: Record<TileType, string> = {
  "1B": "1", "2B": "2", "3B": "3", "4B": "4", "5B": "5",
  "6B": "6", "7B": "7", "8B": "8", "9B": "9", "0B": "0",
  "1C": "1", "2C": "2", "3C": "3", "4C": "4", "5C": "5",
  "6C": "6", "7C": "7", "8C": "8", "9C": "9", "0C": "0",
  "1D": "1", "2D": "2", "3D": "3", "4D": "4", "5D": "5",
  "6D": "6", "7D": "7", "8D": "8", "9D": "9", "0D": "0",
  "N": "N", "E": "E", "W": "W", "S": "S", "D": "D", "F": "F"
};

const TILE_DESCRIPTIONS: Record<TileType, string> = {
  "1B": "1 Bam", "2B": "2 Bam", "3B": "3 Bam", "4B": "4 Bam", "5B": "5 Bam",
  "6B": "6 Bam", "7B": "7 Bam", "8B": "8 Bam", "9B": "9 Bam", "0B": "0 Bam",
  "1C": "1 Crak", "2C": "2 Crak", "3C": "3 Crak", "4C": "4 Crak", "5C": "5 Crak",
  "6C": "6 Crak", "7C": "7 Crak", "8C": "8 Crak", "9C": "9 Crak", "0C": "0 Crak",
  "1D": "1 Dot", "2D": "2 Dot", "3D": "3 Dot", "4D": "4 Dot", "5D": "5 Dot",
  "6D": "6 Dot", "7D": "7 Dot", "8D": "8 Dot", "9D": "9 Dot", "0D": "0 Dot",
  "N": "North Wind", "E": "East Wind", "W": "West Wind", "S": "South Wind",
  "D": "Dragon", "F": "Flower"
};

const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] as const;
const BAMS: TileType[] = ["1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "0B"];
const CRAKS: TileType[] = ["1C", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "0C"];
const DOTS: TileType[] = ["1D", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "0D"];
const HONOR_TILES: TileType[] = ["N", "E", "W", "S", "D", "F"];

/** Card ink slots → display colors (G/R/Bk = three distinct suits in UI, matched to picker rows) */
const PATTERN_INK_CLASS: Record<PatternInk, string> = {
  G: "text-green-600 dark:text-green-400 font-semibold",
  R: "text-red-600 dark:text-red-400 font-semibold",
  Bk: "text-zinc-700 dark:text-zinc-300 font-semibold",
  neutral: "text-zinc-600 dark:text-zinc-400 font-semibold",
};

function splitPatternTokens(pattern: string): string[] {
  return pattern.trim().split(/\s+/).filter(Boolean);
}

// Data structure for NMJL-style reference hands (unofficial; see page disclaimer)
interface MahjongHand {
  category: string;
  pattern: string;
  value: number;
  exposure: "concealed" | "exposed";
  notes?: string;
  id?: string; // Unique identifier for tracking/favorites
  suitType?: "single"; // Only mark single-suit hands (physical card uses colors for multi-suit)
  /** One entry per whitespace-separated token in `pattern` (NMJL card ink → suits) */
  patternInks?: PatternInk[];
}

interface YearCard {
  year: number;
  categories: {
    name: string;
    hands: MahjongHand[];
  }[];
}

// Only years with verified card data (expand when confirmed)
const DEFAULT_MAHJONG_YEAR = 2024;

const CARDS_BY_YEAR: YearCard[] = [
  {
    year: 2024,
    categories: MAHJONG_2024_CATEGORIES,
  },
];

// Helper function to generate a unique ID for each hand
function getHandId(year: number, categoryIndex: number, handIndex: number): string {
  return `${year}-${categoryIndex}-${handIndex}`;
}

// Helper function to count tiles in a pattern (suit-agnostic from pattern data)
function countTilesInPattern(pattern: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const char of pattern.replace(/\s/g, "")) {
    if (NUMBERS.includes(char as any) || ["N", "E", "W", "S", "D", "F"].includes(char)) {
      counts[char] = (counts[char] || 0) + 1;
    }
  }
  return counts;
}

// Helper function to sum tiles across all suits for a given number
function getTotalForNumber(selectedTiles: Record<TileType, number>, number: string): number {
  if (!NUMBERS.includes(number as any)) {
    // Honor tiles (no suits)
    return selectedTiles[number as TileType] || 0;
  }
  // Sum across all three suits
  const bam = selectedTiles[`${number}B` as TileType] || 0;
  const crak = selectedTiles[`${number}C` as TileType] || 0;
  const dot = selectedTiles[`${number}D` as TileType] || 0;
  return bam + crak + dot;
}

// Helper function to calculate how well selected tiles match a hand
function calculateHandMatch(selectedTiles: Record<TileType, number>, pattern: string): number {
  const required = countTilesInPattern(pattern);
  let matchedCount = 0;
  let totalRequired = 0;

  for (const [tile, count] of Object.entries(required)) {
    totalRequired += count;
    const selected = getTotalForNumber(selectedTiles, tile);
    matchedCount += Math.min(selected, count);
  }

  return totalRequired > 0 ? matchedCount / totalRequired : 0;
}

const STORAGE_TILE_TRACKING = "mahjong-tile-tracking-enabled";
const STORAGE_SHOW_HAND_DESCRIPTIONS = "mahjong-show-hand-descriptions";

export default function MahjongRoute() {
  const [selectedYear, setSelectedYear] = useState(DEFAULT_MAHJONG_YEAR);
  const [trackedHands, setTrackedHands] = useState<Set<string>>(new Set());
  const [selectedTiles, setSelectedTiles] = useState<Record<TileType, number>>({} as Record<TileType, number>);
  const [filterMode, setFilterMode] = useState<HandListFilterMode>("all");
  const [showSettings, setShowSettings] = useState(false);
  const [tilesExpanded, setTilesExpanded] = useState(true);
  const [tileTrackingEnabled, setTileTrackingEnabled] = useState(false);
  const [showHandDescriptions, setShowHandDescriptions] = useState(false);

  // Load tracked hands, selected tiles, and tile-tracking preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mahjong-tracked-hands");
      if (saved) {
        try {
          setTrackedHands(new Set(JSON.parse(saved)));
        } catch {
          // Ignore parse errors
        }
      }

      const savedTiles = localStorage.getItem("mahjong-selected-tiles");
      if (savedTiles) {
        try {
          setSelectedTiles(JSON.parse(savedTiles));
        } catch {
          // Ignore parse errors
        }
      }

      const savedTracking = localStorage.getItem(STORAGE_TILE_TRACKING);
      if (savedTracking === "true") {
        setTileTrackingEnabled(true);
      }

      if (localStorage.getItem(STORAGE_SHOW_HAND_DESCRIPTIONS) === "true") {
        setShowHandDescriptions(true);
      }
    }
  }, []);

  // Save tracked hands to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mahjong-tracked-hands", JSON.stringify(Array.from(trackedHands)));
    }
  }, [trackedHands]);

  // Save selected tiles to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mahjong-selected-tiles", JSON.stringify(selectedTiles));
    }
  }, [selectedTiles]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_TILE_TRACKING, tileTrackingEnabled ? "true" : "false");
    }
  }, [tileTrackingEnabled]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_SHOW_HAND_DESCRIPTIONS,
        showHandDescriptions ? "true" : "false"
      );
    }
  }, [showHandDescriptions]);

  useEffect(() => {
    if (!tileTrackingEnabled && filterMode === "matching") {
      setFilterMode("all");
    }
  }, [tileTrackingEnabled, filterMode]);

  const availableYears = CARDS_BY_YEAR.map((card) => card.year).sort(
    (a, b) => b - a
  );
  const currentCard = CARDS_BY_YEAR.find((card) => card.year === selectedYear);

  const toggleTracked = (handId: string) => {
    setTrackedHands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(handId)) {
        newSet.delete(handId);
      } else {
        newSet.add(handId);
      }
      return newSet;
    });
  };

  const resetAllState = () => {
    setTrackedHands(new Set());
    setSelectedTiles({} as Record<TileType, number>);
    setFilterMode("all");
  };

  const toggleTile = (tile: TileType, increment: boolean = true) => {
    setSelectedTiles(prev => {
      const current = prev[tile] || 0;

      // Calculate current total tiles
      const totalTiles = Object.values(prev).reduce((sum, count) => sum + count, 0);

      // American Mahjong hand size is 14, allow up to 15 (hand + 1)
      const MAX_TILES = 15;

      if (increment) {
        // Don't allow adding if we're at the max
        if (totalTiles >= MAX_TILES) {
          return prev;
        }

        let next = current + 1;
        if (next > 4) next = 0; // Wrap around after 4

        if (next === 0) {
          const { [tile]: _, ...rest } = prev;
          return rest as Record<TileType, number>;
        }
        return { ...prev, [tile]: next };
      } else {
        // Decrement
        let next = current - 1;
        if (next < 0) next = 4; // Wrap around backwards

        if (next === 0) {
          const { [tile]: _, ...rest } = prev;
          return rest as Record<TileType, number>;
        }
        return { ...prev, [tile]: next };
      }
    });
  };

  const incrementTile = (tile: TileType) => {
    setSelectedTiles(prev => {
      const current = prev[tile] || 0;
      if (current >= 4) return prev; // Max 4 tiles
      return { ...prev, [tile]: current + 1 };
    });
  };

  const decrementTile = (tile: TileType) => {
    setSelectedTiles(prev => {
      const current = prev[tile] || 0;
      if (current <= 0) return prev;
      if (current === 1) {
        const { [tile]: _, ...rest } = prev;
        return rest as Record<TileType, number>;
      }
      return { ...prev, [tile]: current - 1 };
    });
  };

  const hasSelectedTiles = Object.keys(selectedTiles).length > 0;
  /** Tile picker, match filters, highlights, and summary bar */
  const tileMatchActive = tileTrackingEnabled && hasSelectedTiles;

  useEffect(() => {
    if (filterMode === "matching" && !hasSelectedTiles) {
      setFilterMode("all");
    }
  }, [filterMode, hasSelectedTiles]);

  const currentCardUsesPatternInks = Boolean(
    currentCard?.categories.some((c) =>
      c.hands.some((h) => h.patternInks && h.patternInks.length > 0)
    )
  );

  const renderPatternChar = (char: string, key: string | number) => {
    const hasTile = NUMBERS.includes(char as any)
      ? getTotalForNumber(selectedTiles, char) > 0
      : ["N", "E", "W", "S", "D", "F"].includes(char) &&
        (selectedTiles[char as TileType] || 0) > 0;

    if (hasTile) {
      return (
        <span
          key={key}
          className="bg-zinc-700 dark:bg-zinc-500 text-white px-0.5 rounded font-bold"
        >
          {char}
        </span>
      );
    }
    return <span key={key}>{char}</span>;
  };

  const renderPatternPlainHighlights = (pattern: string) =>
    pattern.split("").map((char, index) => renderPatternChar(char, index));

  const renderHandPattern = (hand: MahjongHand) => {
    const tokens = splitPatternTokens(hand.pattern);
    const inks = hand.patternInks;
    const useInks = Boolean(inks && inks.length === tokens.length);

    if (!useInks) {
      if (tileMatchActive) {
        return renderPatternPlainHighlights(hand.pattern);
      }
      return hand.pattern;
    }

    const inkList = inks as PatternInk[];
    return tokens.map((token, i) => (
      <span key={i}>
        {i > 0 ? " " : null}
        <span className={PATTERN_INK_CLASS[inkList[i]]}>
          {tileMatchActive
            ? token.split("").map((char, j) => renderPatternChar(char, `${i}-${j}`))
            : token}
        </span>
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              American Mahjong {selectedYear}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              National Mah Jongg League (NMJL) winning hands
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowSettings(false)}>
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
              <div
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Track tiles against hands
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Shows the tile picker, match filters, pattern highlights, and the hand summary bar. Off by default.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={tileTrackingEnabled}
                      onClick={() => setTileTrackingEnabled((v) => !v)}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                        tileTrackingEnabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition ${
                          tileTrackingEnabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Hand descriptions
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Suit and pattern notes below each hand. Off by default.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showHandDescriptions}
                      onClick={() => setShowHandDescriptions((v) => !v)}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                        showHandDescriptions ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition ${
                          showHandDescriptions ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="year-select"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Card Year
                    </label>
                    <select
                      id="year-select"
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(Number(e.target.value));
                        setShowSettings(false);
                      }}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base"
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      NMJL releases a new card every April
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => {
                        resetAllState();
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-2 rounded-md text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Reset All Data
                    </button>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                      Clears tracked hands and selected tiles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suit / pattern colors (short) */}
        <div className="mb-4 sm:mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Reading the patterns
          </p>
          <div className="flex flex-col gap-2 text-xs text-blue-700 dark:text-blue-300">
            {currentCardUsesPatternInks ? (
              <p>
                <span className="font-mono font-medium">
                  <span className={PATTERN_INK_CLASS.G}>G</span> /{" "}
                  <span className={PATTERN_INK_CLASS.R}>R</span> /{" "}
                  <span className={PATTERN_INK_CLASS.Bk}>Bk</span>
                </span>{" "}
                follow NMJL ink: same color = same suit; different colors = different suits. Here they
                line up with Bams / Craks / Dots
                {tileTrackingEnabled ? " in the tile picker" : " (enable Track tiles in Settings for the picker)"}.
                <span className={`font-mono ${PATTERN_INK_CLASS.neutral}`}> Gray + × =</span> are operators,
                not tiles.
              </p>
            ) : (
              <p>Pattern text is plain—use your printed card for suit rules on this year.</p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">
              Filter Hands
            </span>
            <HandListFilterToggle
              filterMode={filterMode}
              onModeChange={setFilterMode}
              trackedCount={trackedHands.size}
              tileTrackingEnabled={tileTrackingEnabled}
              hasSelectedTiles={hasSelectedTiles}
            />
          </div>

          <details className="mt-3 rounded-lg border border-gray-200 bg-gray-50 open:[&_summary_svg]:rotate-90 dark:border-gray-600 dark:bg-gray-800/60">
            <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100/80 dark:text-gray-200 dark:hover:bg-gray-700/50 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 shrink-0 text-gray-500 transition-transform dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Pattern symbol legend
              </span>
            </summary>
            <div className="border-t border-gray-200 px-3 py-3 text-xs text-gray-700 dark:border-gray-600 dark:text-gray-300">
              <dl className="space-y-2.5">
                <div>
                  <dt className="font-semibold text-gray-900 dark:text-white">Digits 1–9, 0</dt>
                  <dd className="mt-0.5 text-gray-600 dark:text-gray-400">
                    Number tiles in each suit. <span className="font-mono font-medium">0</span> is soap
                    (zero), as on the NMJL card.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900 dark:text-white">F</dt>
                  <dd className="mt-0.5 text-gray-600 dark:text-gray-400">Flowers.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900 dark:text-white">N, E, W, S</dt>
                  <dd className="mt-0.5 text-gray-600 dark:text-gray-400">
                    North, East, West, South winds.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900 dark:text-white">D</dt>
                  <dd className="mt-0.5 text-gray-600 dark:text-gray-400">
                    Dragon tiles (which dragon follows your card).
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900 dark:text-white">Spaces</dt>
                  <dd className="mt-0.5 text-gray-600 dark:text-gray-400">
                    Separate melds or groups as printed on the card line.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900 dark:text-white">
                    <span className={`font-mono ${PATTERN_INK_CLASS.neutral}`}>+</span>,{" "}
                    <span className={`font-mono ${PATTERN_INK_CLASS.neutral}`}>×</span>,{" "}
                    <span className={`font-mono ${PATTERN_INK_CLASS.neutral}`}>x</span>,{" "}
                    <span className={`font-mono ${PATTERN_INK_CLASS.neutral}`}>=</span>
                  </dt>
                  <dd className="mt-0.5 text-gray-600 dark:text-gray-400">
                    Operators for addition or multiplication hands—notation only, not tiles.
                  </dd>
                </div>
                {currentCardUsesPatternInks ? (
                  <div>
                    <dt className="font-semibold text-gray-900 dark:text-white">
                      <span className={PATTERN_INK_CLASS.G}>G</span>,{" "}
                      <span className={PATTERN_INK_CLASS.R}>R</span>,{" "}
                      <span className={PATTERN_INK_CLASS.Bk}>Bk</span>
                    </dt>
                    <dd className="mt-0.5 text-gray-600 dark:text-gray-400">
                      Ink colors from the card: same ink = same suit; different inks = different suits.
                      Here they align with Bams / Craks / Dots in the tile picker.
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </details>
        </div>

        {/* Tile Selector */}
        {tileTrackingEnabled ? (
        <div className="mb-6 sm:mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setTilesExpanded(!tilesExpanded)}
              className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className={`w-5 h-5 transition-transform ${tilesExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Your Tiles
            </button>
            {hasSelectedTiles && (
              <span className={`text-sm font-medium ${
                Object.values(selectedTiles).reduce((sum, count) => sum + count, 0) >= 15
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {Object.values(selectedTiles).reduce((sum, count) => sum + count, 0)} / 15 tiles
              </span>
            )}
          </div>

          {tilesExpanded && (
            <>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Tap tiles to add, right-click to remove
              </p>
          <div className="space-y-4">
            {/* Bams */}
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">Bams (Bamboos)</p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {BAMS.map((tile) => (
                  <button
                    key={tile}
                    type="button"
                    onClick={() => toggleTile(tile, true)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleTile(tile, false);
                    }}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-lg font-mono text-lg font-bold transition-all active:scale-95 sm:text-xl ${
                      selectedTiles[tile]
                        ? "bg-green-500 text-white shadow-lg dark:bg-green-600"
                        : "border-2 border-green-300 bg-white text-gray-900 dark:border-green-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    title={TILE_DESCRIPTIONS[tile]}
                  >
                    <div className="text-2xl">{TILE_LABELS[tile]}</div>
                    {selectedTiles[tile] ? (
                      <div className="absolute top-1 right-1 text-xs bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {selectedTiles[tile]}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            {/* Craks */}
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">Craks (Characters)</p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {CRAKS.map((tile) => (
                  <button
                    key={tile}
                    type="button"
                    onClick={() => toggleTile(tile, true)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleTile(tile, false);
                    }}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-lg font-mono text-lg font-bold transition-all active:scale-95 sm:text-xl ${
                      selectedTiles[tile]
                        ? "bg-red-500 text-white shadow-lg dark:bg-red-600"
                        : "border-2 border-red-300 bg-white text-gray-900 dark:border-red-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    title={TILE_DESCRIPTIONS[tile]}
                  >
                    <div className="text-2xl">{TILE_LABELS[tile]}</div>
                    {selectedTiles[tile] ? (
                      <div className="absolute top-1 right-1 text-xs bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {selectedTiles[tile]}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Dots (Circles)</p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {DOTS.map((tile) => (
                  <button
                    key={tile}
                    type="button"
                    onClick={() => toggleTile(tile, true)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleTile(tile, false);
                    }}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-lg font-mono text-lg font-bold transition-all active:scale-95 sm:text-xl ${
                      selectedTiles[tile]
                        ? "bg-blue-500 text-white shadow-lg dark:bg-blue-600"
                        : "border-2 border-blue-300 bg-white text-gray-900 dark:border-blue-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    title={TILE_DESCRIPTIONS[tile]}
                  >
                    <div className="text-2xl">{TILE_LABELS[tile]}</div>
                    {selectedTiles[tile] ? (
                      <div className="absolute top-1 right-1 text-xs bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {selectedTiles[tile]}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            {/* Honor Tiles */}
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">Winds, Dragons, Flowers</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {HONOR_TILES.map((tile) => (
                  <button
                    key={tile}
                    type="button"
                    onClick={() => toggleTile(tile, true)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleTile(tile, false);
                    }}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-lg font-mono text-lg font-bold transition-all active:scale-95 sm:text-xl ${
                      selectedTiles[tile]
                        ? "bg-purple-500 text-white shadow-lg dark:bg-purple-600"
                        : "border-2 border-purple-300 bg-white text-gray-900 dark:border-purple-600 dark:bg-gray-700 dark:text-white"
                    }`}
                    title={TILE_DESCRIPTIONS[tile]}
                  >
                    <div className="text-2xl">{tile}</div>
                    {selectedTiles[tile] ? (
                      <div className="absolute top-1 right-1 text-xs bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {selectedTiles[tile]}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
            </>
          )}
        </div>
        ) : null}

        {/* Card Content */}
        {currentCard ? (
          <div className="space-y-6 sm:space-y-8">
            {filterMode === "tracked" && trackedHands.size === 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <p className="text-yellow-800 dark:text-yellow-200">
                  No tracked hands yet. Tap the bookmark on any hand to add it to your list.
                </p>
              </div>
            )}
            {currentCard.categories.map((category, categoryIndex) => {
              const handsToShow = category.hands
                .map((hand, handIndex) => ({ hand, handIndex, handId: getHandId(selectedYear, categoryIndex, handIndex) }))
                .filter(({ hand, handId }) => {
                  // Apply tracked filter
                  if (filterMode === "tracked" && !trackedHands.has(handId)) {
                    return false;
                  }

                  // Apply match percentage filter
                  if (filterMode === "matching") {
                    if (!tileMatchActive) {
                      return true;
                    }
                    const matchScore = calculateHandMatch(
                      selectedTiles,
                      hand.pattern
                    );
                    return matchScore > 0;
                  }

                  // "all" mode - show everything
                  return true;
                });

              if (handsToShow.length === 0) return null;

              return (
                <div
                  key={categoryIndex}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    {category.name}
                  </h2>
                  <div className="space-y-3">
                    {handsToShow.map(({ hand, handIndex, handId }) => {
                      const matchScore = tileMatchActive
                        ? calculateHandMatch(selectedTiles, hand.pattern)
                        : 0;
                      const isTracked = trackedHands.has(handId);

                      // Determine background color based on match score
                      let bgColorClass = "bg-white dark:bg-gray-700";
                      let borderColorClass = "";
                      if (tileMatchActive && matchScore > 0) {
                        if (matchScore >= 0.75) {
                          bgColorClass = "bg-green-50 dark:bg-green-900/20";
                          borderColorClass = "border-2 border-green-500 dark:border-green-600";
                        } else if (matchScore >= 0.5) {
                          bgColorClass = "bg-yellow-50 dark:bg-yellow-900/20";
                          borderColorClass = "border-2 border-yellow-500 dark:border-yellow-600";
                        } else if (matchScore >= 0.25) {
                          bgColorClass = "bg-orange-50 dark:bg-orange-900/20";
                          borderColorClass = "border-2 border-orange-500 dark:border-orange-600";
                        }
                      }

                      return (
                        <div
                          key={handIndex}
                          className={`relative rounded-md p-3 sm:p-4 pt-3 pr-12 sm:pr-14 flex flex-col gap-2 ${bgColorClass} ${borderColorClass}`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleTracked(handId)}
                            className={`absolute top-2 right-2 z-10 rounded-md p-1.5 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:focus:ring-zinc-500 dark:focus:ring-offset-gray-800 ${
                              isTracked
                                ? "bg-zinc-800 text-white dark:bg-zinc-600"
                                : "bg-white/90 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-600/90 dark:text-gray-200 dark:ring-gray-500 dark:hover:bg-gray-600"
                            }`}
                            aria-label={isTracked ? "Remove from tracked hands" : "Track hand"}
                            title={isTracked ? "Untrack hand" : "Track hand"}
                          >
                            {isTracked ? (
                              <svg
                                className="h-5 w-5 sm:h-6 sm:w-6"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-5 w-5 sm:h-6 sm:w-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                aria-hidden
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                />
                              </svg>
                            )}
                          </button>
                          <div className="min-w-0 overflow-x-auto">
                            <code
                              className={`text-lg sm:text-xl lg:text-2xl font-mono whitespace-nowrap ${
                                hand.patternInks?.length ===
                                splitPatternTokens(hand.pattern).length
                                  ? ""
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {renderHandPattern(hand)}
                            </code>
                          </div>
                          {hand.suitType === "single" && (
                            <span
                              className="self-start px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                              title="All number tiles must be from one suit"
                            >
                              1 Suit
                            </span>
                          )}
                          {showHandDescriptions && hand.notes && (
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic">
                              {hand.notes}
                            </p>
                          )}
                          {tileMatchActive && matchScore > 0 && (
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Match: {Math.round(matchScore * 100)}%
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="rounded-lg border border-blue-200 bg-blue-50/80 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/15">
              <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                Not affiliated with the NMJL. This page is a study aid only—buy the official{" "}
                <a
                  href="https://www.nationalmahjonggleague.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline decoration-blue-600/50 underline-offset-2 hover:no-underline dark:decoration-blue-400/50"
                >
                  current-year card
                </a>{" "}
                for real play, points, and rules.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <p className="text-yellow-800 dark:text-yellow-200">
              No card data available for {selectedYear}. Please add the card
              data to the CARDS_BY_YEAR array in the route file.
            </p>
          </div>
        )}
      </div>

      {/* Floating Bottom Panel - Selected Tiles Summary */}
      {tileTrackingEnabled && hasSelectedTiles && (
        <div className="fixed bottom-0 left-0 right-0 z-40 animate-in slide-in-from-bottom duration-300">
          <div className="bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Your Hand (tap to remove):
                </p>
                <span className={`text-xs font-bold ${
                  Object.values(selectedTiles).reduce((sum, count) => sum + count, 0) >= 15
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {Object.values(selectedTiles).reduce((sum, count) => sum + count, 0)} / 15
                </span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {Object.entries(selectedTiles)
                  .sort(([a], [b]) => {
                    // Sort by suit then by number
                    const suitOrder = { B: 0, C: 1, D: 2, '': 3 };
                    const getSuit = (tile: string) => tile.length > 1 ? tile[1] : '';
                    const getNum = (tile: string) => tile[0];

                    const suitA = getSuit(a);
                    const suitB = getSuit(b);
                    const numA = getNum(a);
                    const numB = getNum(b);

                    if (suitA !== suitB) return (suitOrder[suitA as keyof typeof suitOrder] || 99) - (suitOrder[suitB as keyof typeof suitOrder] || 99);
                    return numA.localeCompare(numB);
                  })
                  .map(([tile, count], index) => {
                    const isHonor = HONOR_TILES.includes(tile as TileType);
                    const isBam = BAMS.includes(tile as TileType);
                    const isCrak = CRAKS.includes(tile as TileType);
                    const isDot = DOTS.includes(tile as TileType);

                    let colorClass = "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500";
                    if (isBam) colorClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800";
                    if (isCrak) colorClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800";
                    if (isDot) colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800";
                    if (isHonor) colorClass = "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800";

                    return (
                      <button
                        key={tile}
                        type="button"
                        onClick={() => {
                          setSelectedTiles((prev) => {
                            const { [tile as TileType]: _, ...rest } = prev;
                            return rest as Record<TileType, number>;
                          });
                        }}
                        style={{ animationDelay: `${index * 30}ms` }}
                        className={`inline-flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 hover:scale-105 hover:shadow-md active:scale-95 ${colorClass}`}
                        title={`Click to remove ${TILE_DESCRIPTIONS[tile as TileType]}`}
                      >
                        <span className="font-mono text-xs">{TILE_DESCRIPTIONS[tile as TileType]}</span>
                        <span className="text-xs font-bold">×{count}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
