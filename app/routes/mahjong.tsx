import type { Route } from "./+types/mahjong";
import { useState, useEffect } from "react";

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

// Data structure for NMJL cards
// Data sourced from I Love Mahj (ilovemahj.com) card analysis
// Used with permission under their Creative Commons license
interface MahjongHand {
  category: string;
  pattern: string;
  value: number;
  exposure: "concealed" | "exposed";
  notes?: string;
  id?: string; // Unique identifier for tracking/favorites
  suitType?: "single" | "multi" | "any"; // Suit requirement indicator
}

interface YearCard {
  year: number;
  categories: {
    name: string;
    hands: MahjongHand[];
  }[];
}

// Card data from I Love Mahj analysis
const CARDS_BY_YEAR: YearCard[] = [
  {
    year: 2025,
    categories: [
      {
        name: "2025",
        hands: [
          {
            category: "2025",
            pattern: "FFFF 222 55 2025",
            value: 25,
            exposure: "exposed",
            notes: "4 Flowers + pungs of 2s or 5s (matching)",
          },
          {
            category: "2025",
            pattern: "222 5555 222 5555",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 3-4-3-4 with 2s and 5s",
          },
          {
            category: "2025",
            pattern: "2 00 22 555 DDDD 2025",
            value: 30,
            exposure: "exposed",
            notes: "Three-suit hand with 2025, pungs of 2s & 5s, Dragon kong",
            suitType: "multi",
          },
          {
            category: "2025",
            pattern: "20 252 025 202 505",
            value: 25,
            exposure: "concealed",
            notes: "Pattern 2-3-3-3-3",
          },
        ],
      },
      {
        name: "2468 (EVENS)",
        hands: [
          {
            category: "2468",
            pattern: "222 4444 666 8888",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 3-4-3-4 with even numbers",
          },
          {
            category: "2468",
            pattern: "24 682 46 824 68",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-3-2-3-4",
          },
          {
            category: "2468",
            pattern: "22 44 666 888 2468",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-2-3-3-4",
          },
          {
            category: "2468",
            pattern: "FFFF 22 4444 6666",
            value: 25,
            exposure: "exposed",
            notes: "4 Flowers + matching even pungs",
          },
          {
            category: "2468",
            pattern: "FFF 2222 4444 6666",
            value: 25,
            exposure: "exposed",
            notes: "One-suit with 3 Flowers",
            suitType: "single",
          },
          {
            category: "2468",
            pattern: "24 68 2468 24 68",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-2-4-2-2",
          },
          {
            category: "2468",
            pattern: "22 4444 6666 8888",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-4-4-4",
          },
          {
            category: "2468",
            pattern: "22 44 66 88 22 44 66",
            value: 30,
            exposure: "concealed",
            notes: "Concealed, 4 pairs + pairs of evens",
          },
        ],
      },
      {
        name: "ANY LIKE NUMBERS",
        hands: [
          {
            category: "ANY LIKE NUMBERS",
            pattern: "11 2222 3 3333 4 44",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-4-1-4-1-2",
          },
          {
            category: "ANY LIKE NUMBERS",
            pattern: "1111 22 333 444 55",
            value: 30,
            exposure: "exposed",
            notes: "Pattern 4-2-3-3-2, two identical pairs (no Jokers)",
          },
          {
            category: "ANY LIKE NUMBERS",
            pattern: "11 222 333 444 555",
            value: 25,
            exposure: "concealed",
            notes: "Pattern 2-3-3-3-3",
          },
        ],
      },
      {
        name: "QUINTS",
        hands: [
          {
            category: "QUINTS",
            pattern: "11111 2222 3333 DD",
            value: 30,
            exposure: "exposed",
            notes: "Quint + 2 kongs + pair of dragons",
          },
          {
            category: "QUINTS",
            pattern: "11111 22222 333 DD",
            value: 35,
            exposure: "exposed",
            notes: "2 Quints + pung + pair of dragons",
          },
          {
            category: "QUINTS",
            pattern: "11111 22222 33333 D",
            value: 50,
            exposure: "exposed",
            notes: "3 Quints + single dragon",
          },
        ],
      },
      {
        name: "CONSECUTIVE RUN",
        hands: [
          {
            category: "CONSECUTIVE RUN",
            pattern: "1111 2222 3333 4444",
            value: 30,
            exposure: "exposed",
            notes: "4 consecutive kongs",
          },
          {
            category: "CONSECUTIVE RUN",
            pattern: "111 2222 3333 4444 5",
            value: 30,
            exposure: "exposed",
            notes: "Consecutive pung-kong-kong-kong-single",
          },
          {
            category: "CONSECUTIVE RUN",
            pattern: "11 222 3333 5555 666",
            value: 30,
            exposure: "exposed",
            notes: "Consecutive with gap",
          },
          {
            category: "CONSECUTIVE RUN",
            pattern: "1111 222 333 4444 55",
            value: 30,
            exposure: "exposed",
            notes: "Kong-pung-pung-kong-pair",
          },
          {
            category: "CONSECUTIVE RUN",
            pattern: "111 222 333 444 555 66",
            value: 35,
            exposure: "exposed",
            notes: "5 consecutive pungs + pair",
          },
        ],
      },
      {
        name: "13579 (ODDS)",
        hands: [
          {
            category: "13579",
            pattern: "111 3333 555 7777",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 3-4-3-4 with odd numbers",
          },
          {
            category: "13579",
            pattern: "13 579 15 937 79",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-3-2-3-2",
          },
          {
            category: "13579",
            pattern: "11 33 555 777 9999",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-2-3-3-4",
          },
          {
            category: "13579",
            pattern: "FFFF 111 333 13579",
            value: 25,
            exposure: "exposed",
            notes: "4 Flowers + 2 pungs + singles",
          },
          {
            category: "13579",
            pattern: "FFF 1111 3333 5555",
            value: 25,
            exposure: "exposed",
            notes: "3 Flowers + 3 kongs (one suit)",
            suitType: "single",
          },
          {
            category: "13579",
            pattern: "11 33 55 77 99 11 33",
            value: 30,
            exposure: "concealed",
            notes: "Concealed pairs of odds",
          },
        ],
      },
      {
        name: "WINDS - DRAGONS",
        hands: [
          {
            category: "WINDS - DRAGONS",
            pattern: "NNNN EEEE WWWW SSSS",
            value: 30,
            exposure: "exposed",
            notes: "4 winds kongs",
          },
          {
            category: "WINDS - DRAGONS",
            pattern: "NNN EEE WWW SSS DD",
            value: 25,
            exposure: "exposed",
            notes: "4 winds pungs + pair of dragons",
          },
          {
            category: "WINDS - DRAGONS",
            pattern: "DDDD DDDD DDDD NEWS",
            value: 30,
            exposure: "exposed",
            notes: "3 dragon kongs + 1 of each wind",
          },
          {
            category: "WINDS - DRAGONS",
            pattern: "DDD DDD DDD NNNN EE",
            value: 30,
            exposure: "exposed",
            notes: "3 dragon pungs + wind kong + pair",
          },
          {
            category: "WINDS - DRAGONS",
            pattern: "NNN EEEE WWWW SSSS D",
            value: 35,
            exposure: "exposed",
            notes: "Pung + 3 kongs + single dragon",
          },
          {
            category: "WINDS - DRAGONS",
            pattern: "DDDD DDDD DDDD NN EE",
            value: 40,
            exposure: "exposed",
            notes: "3 dragon kongs + 2 wind pairs",
          },
        ],
      },
      {
        name: "369",
        hands: [
          {
            category: "369",
            pattern: "333 6666 999 3333",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 3-4-3-4",
          },
          {
            category: "369",
            pattern: "36 963 69 336 99",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-3-2-3-2",
          },
          {
            category: "369",
            pattern: "33 66 999 333 6666",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-2-3-3-4",
          },
          {
            category: "369",
            pattern: "FFF 3333 6666 9999",
            value: 25,
            exposure: "exposed",
            notes: "3 Flowers + 3 kongs",
          },
        ],
      },
      {
        name: "SINGLES AND PAIRS",
        hands: [
          {
            category: "SINGLES AND PAIRS",
            pattern: "11 22 33 44 55 66 77",
            value: 25,
            exposure: "concealed",
            notes: "7 pairs",
          },
          {
            category: "SINGLES AND PAIRS",
            pattern: "FF 11 22 33 44 55 66",
            value: 30,
            exposure: "concealed",
            notes: "2 Flowers + 6 pairs",
          },
          {
            category: "SINGLES AND PAIRS",
            pattern: "NEWS DD DD DD 1234567",
            value: 35,
            exposure: "concealed",
            notes: "NEWS + 3 dragon pairs + run",
          },
        ],
      },
    ],
  },
  {
    year: 2024,
    categories: [
      {
        name: "2024",
        hands: [
          {
            category: "2024",
            pattern: "222 000 2222 4444",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 3-3-4-4",
          },
          {
            category: "2024",
            pattern: "2222 0000 4444 2 0",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 4-4-4-1-1",
          },
          {
            category: "2024",
            pattern: "20 2 0 2 4 2222 0000",
            value: 25,
            exposure: "exposed",
            notes: "Flexible kongs: 2s or 0s",
          },
          {
            category: "2024",
            pattern: "22 000 2 0 2 4 000 24",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-3-1-1-1-1-3-2",
          },
        ],
      },
      {
        name: "2468 (EVENS)",
        hands: [
          {
            category: "2468",
            pattern: "222 444 6666 8888",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 3-3-4-4",
          },
          {
            category: "2468",
            pattern: "24 682 46 824 2468",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-3-2-3-4",
          },
          {
            category: "2468",
            pattern: "22 44 666 888 2468",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-2-3-3-4",
          },
          {
            category: "2468",
            pattern: "2222 4444 6666 2 4",
            value: 25,
            exposure: "exposed",
            notes: "3 kongs + 2 singles",
          },
          {
            category: "2468",
            pattern: "24 6688 24 68 2244",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-4-2-2-4",
          },
          {
            category: "2468",
            pattern: "22 444 66 888 24 68",
            value: 25,
            exposure: "concealed",
            notes: "Pattern 2-3-2-3-2-2",
          },
        ],
      },
      {
        name: "ADDITION",
        hands: [
          {
            category: "ADDITION",
            pattern: "22 4444 6666 2222",
            value: 25,
            exposure: "exposed",
            notes: "2+4=6",
          },
          {
            category: "ADDITION",
            pattern: "22 6666 8888 2222",
            value: 25,
            exposure: "exposed",
            notes: "2+6=8",
          },
          {
            category: "ADDITION",
            pattern: "44 6666 2222 4444",
            value: 25,
            exposure: "exposed",
            notes: "4+6=10 (1+0=1)",
          },
        ],
      },
      {
        name: "ANY LIKE NUMBERS",
        hands: [
          {
            category: "ANY LIKE NUMBERS",
            pattern: "1111 222 3333 444",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 4-3-4-3",
          },
          {
            category: "ANY LIKE NUMBERS",
            pattern: "11 222 33 444 5555",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-3-2-3-4",
          },
          {
            category: "ANY LIKE NUMBERS",
            pattern: "11 2222 333 4444 55",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-4-3-4-2",
          },
          {
            category: "ANY LIKE NUMBERS",
            pattern: "1111 22 333 444 5555",
            value: 30,
            exposure: "exposed",
            notes: "No Jokers in pairs",
          },
          {
            category: "ANY LIKE NUMBERS",
            pattern: "11 222 333 444 5555",
            value: 25,
            exposure: "concealed",
            notes: "Pattern 2-3-3-3-4",
          },
        ],
      },
      {
        name: "QUINTS",
        hands: [
          {
            category: "QUINTS",
            pattern: "11111 2222 3333 DD",
            value: 30,
            exposure: "exposed",
            notes: "Quint + 2 kongs + dragon pair",
          },
          {
            category: "QUINTS",
            pattern: "11111 22222 333 DD",
            value: 35,
            exposure: "exposed",
            notes: "2 Quints + pung + dragon pair",
          },
          {
            category: "QUINTS",
            pattern: "11111 22222 33333 D",
            value: 50,
            exposure: "exposed",
            notes: "3 Quints + single dragon",
          },
        ],
      },
      {
        name: "CONSECUTIVE RUN",
        hands: [
          {
            category: "CONSECUTIVE RUN",
            pattern: "1111 2222 3333 4444",
            value: 30,
            exposure: "exposed",
            notes: "4 consecutive kongs",
          },
          {
            category: "CONSECUTIVE RUN",
            pattern: "111 2222 3333 4444 5",
            value: 30,
            exposure: "exposed",
            notes: "Consecutive run with single",
          },
          {
            category: "CONSECUTIVE RUN",
            pattern: "11 222 3333 5555 666",
            value: 30,
            exposure: "exposed",
            notes: "Consecutive with gap at 4",
          },
          {
            category: "CONSECUTIVE RUN",
            pattern: "1111 222 333 4444 55",
            value: 30,
            exposure: "exposed",
            notes: "Kong-pung-pung-kong-pair",
          },
          {
            category: "CONSECUTIVE RUN",
            pattern: "111 222 333 444 555 66",
            value: 35,
            exposure: "exposed",
            notes: "5 consecutive pungs + pair",
          },
        ],
      },
      {
        name: "13579 (ODDS)",
        hands: [
          {
            category: "13579",
            pattern: "111 333 5555 7777",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 3-3-4-4",
          },
          {
            category: "13579",
            pattern: "13 579 15 937 13579",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-3-2-3-5",
          },
          {
            category: "13579",
            pattern: "11 33 555 777 9999",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-2-3-3-4",
          },
          {
            category: "13579",
            pattern: "1111 3333 5555 1 3",
            value: 25,
            exposure: "exposed",
            notes: "3 kongs + 2 singles",
          },
          {
            category: "13579",
            pattern: "11 33 55 77 99 11 33",
            value: 30,
            exposure: "concealed",
            notes: "7 pairs of odds",
          },
        ],
      },
      {
        name: "WINDS - DRAGONS",
        hands: [
          {
            category: "WINDS - DRAGONS",
            pattern: "NNNN EEEE WWWW SSSS",
            value: 30,
            exposure: "exposed",
            notes: "4 winds kongs",
          },
          {
            category: "WINDS - DRAGONS",
            pattern: "NNN EEE WWW SSS DD",
            value: 25,
            exposure: "exposed",
            notes: "4 winds pungs + dragon pair",
          },
          {
            category: "WINDS - DRAGONS",
            pattern: "DDDD DDDD DDDD NEWS",
            value: 30,
            exposure: "exposed",
            notes: "3 dragon kongs + NEWS",
          },
          {
            category: "WINDS - DRAGONS",
            pattern: "DDD DDD DDD NNNN EE",
            value: 30,
            exposure: "exposed",
            notes: "3 dragon pungs + kong + pair",
          },
          {
            category: "WINDS - DRAGONS",
            pattern: "NNN EEEE WWWW SSSS D",
            value: 35,
            exposure: "exposed",
            notes: "Pung + 3 kongs + dragon",
          },
          {
            category: "WINDS - DRAGONS",
            pattern: "DDDD DDDD DDDD NN EE",
            value: 40,
            exposure: "exposed",
            notes: "3 dragon kongs + 2 wind pairs",
          },
        ],
      },
      {
        name: "369",
        hands: [
          {
            category: "369",
            pattern: "333 666 9999 3333",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 3-3-4-4",
          },
          {
            category: "369",
            pattern: "36 963 69 336 369",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-3-2-3-3",
          },
          {
            category: "369",
            pattern: "33 66 999 333 6666",
            value: 25,
            exposure: "exposed",
            notes: "Pattern 2-2-3-3-4",
          },
          {
            category: "369",
            pattern: "3333 6666 9999 3 6",
            value: 25,
            exposure: "exposed",
            notes: "3 kongs + 2 singles",
          },
        ],
      },
      {
        name: "SINGLES AND PAIRS",
        hands: [
          {
            category: "SINGLES AND PAIRS",
            pattern: "11 22 33 44 55 66 77",
            value: 25,
            exposure: "concealed",
            notes: "7 pairs",
          },
          {
            category: "SINGLES AND PAIRS",
            pattern: "FF 11 22 33 44 55 66",
            value: 30,
            exposure: "concealed",
            notes: "2 Flowers + 6 pairs",
          },
          {
            category: "SINGLES AND PAIRS",
            pattern: "NEWS DD DD DD 1234567",
            value: 35,
            exposure: "concealed",
            notes: "NEWS + dragon pairs + run",
          },
        ],
      },
    ],
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

export default function MahjongRoute() {
  // Default to the latest year available in our data
  const latestYear = Math.max(...CARDS_BY_YEAR.map(card => card.year));
  const [selectedYear, setSelectedYear] = useState(latestYear);
  const [trackedHands, setTrackedHands] = useState<Set<string>>(new Set());
  const [selectedTiles, setSelectedTiles] = useState<Record<TileType, number>>({} as Record<TileType, number>);
  const [filterMode, setFilterMode] = useState<"all" | "tracked" | number>("all");
  const [showSettings, setShowSettings] = useState(false);
  const [tilesExpanded, setTilesExpanded] = useState(true);

  // Load tracked hands and selected tiles from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mahjong-tracked-hands");
      if (saved) {
        try {
          setTrackedHands(new Set(JSON.parse(saved)));
        } catch (e) {
          // Ignore parse errors
        }
      }

      const savedTiles = localStorage.getItem("mahjong-selected-tiles");
      if (savedTiles) {
        try {
          setSelectedTiles(JSON.parse(savedTiles));
        } catch (e) {
          // Ignore parse errors
        }
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

  // Helper function to render pattern with highlighted tiles
  const renderPatternWithHighlights = (pattern: string) => {
    return pattern.split('').map((char, index) => {
      // Check if this character is a tile the user has
      const hasTile = NUMBERS.includes(char as any)
        ? getTotalForNumber(selectedTiles, char) > 0
        : (["N", "E", "W", "S", "D", "F"].includes(char) && (selectedTiles[char as TileType] || 0) > 0);

      if (hasTile) {
        return (
          <span
            key={index}
            className="bg-blue-500 dark:bg-blue-600 text-white px-0.5 rounded font-bold"
          >
            {char}
          </span>
        );
      }
      return <span key={index}>{char}</span>;
    });
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
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    onClick={() => setShowSettings(false)}
                    className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
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

        {/* Suit Type Legend */}
        <div className="mb-4 sm:mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 mb-2 font-medium">
            Understanding Suit Requirements:
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium">
                1 Suit
              </span>
              <span className="text-blue-700 dark:text-blue-300">All numbers from one suit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                Multi-Suit
              </span>
              <span className="text-blue-700 dark:text-blue-300">Requires multiple suits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-700 dark:text-blue-300 italic">No badge = Flexible (any suit configuration)</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 sm:mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter Hands
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterMode === "all"
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Show All
            </button>
            <button
              onClick={() => setFilterMode("tracked")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterMode === "tracked"
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Tracked Only {trackedHands.size > 0 && `(${trackedHands.size})`}
            </button>
            {hasSelectedTiles && (
              <>
                <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                <button
                  onClick={() => setFilterMode(25)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterMode === 25
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  ≥25% Match
                </button>
                <button
                  onClick={() => setFilterMode(50)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterMode === 50
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  ≥50% Match
                </button>
                <button
                  onClick={() => setFilterMode(75)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterMode === 75
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  ≥75% Match
                </button>
                <button
                  onClick={() => setFilterMode(100)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterMode === 100
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  100% Match
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tile Selector */}
        <div className="mb-6 sm:mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <button
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
                    onClick={() => toggleTile(tile, true)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleTile(tile, false);
                    }}
                    className={`aspect-square rounded-lg font-mono font-bold text-lg sm:text-xl transition-all active:scale-95 flex flex-col items-center justify-center relative ${
                      selectedTiles[tile]
                        ? "bg-green-500 text-white dark:bg-green-600 shadow-lg"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-green-300 dark:border-green-600"
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
                    onClick={() => toggleTile(tile, true)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleTile(tile, false);
                    }}
                    className={`aspect-square rounded-lg font-mono font-bold text-lg sm:text-xl transition-all active:scale-95 flex flex-col items-center justify-center relative ${
                      selectedTiles[tile]
                        ? "bg-red-500 text-white dark:bg-red-600 shadow-lg"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-red-300 dark:border-red-600"
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
                    onClick={() => toggleTile(tile, true)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleTile(tile, false);
                    }}
                    className={`aspect-square rounded-lg font-mono font-bold text-lg sm:text-xl transition-all active:scale-95 flex flex-col items-center justify-center relative ${
                      selectedTiles[tile]
                        ? "bg-blue-500 text-white dark:bg-blue-600 shadow-lg"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-blue-300 dark:border-blue-600"
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
                    onClick={() => toggleTile(tile, true)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleTile(tile, false);
                    }}
                    className={`aspect-square rounded-lg font-mono font-bold text-lg sm:text-xl transition-all active:scale-95 flex flex-col items-center justify-center relative ${
                      selectedTiles[tile]
                        ? "bg-purple-500 text-white dark:bg-purple-600 shadow-lg"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-purple-300 dark:border-purple-600"
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

        {/* Card Content */}
        {currentCard ? (
          <div className="space-y-6 sm:space-y-8">
            {filterMode === "tracked" && trackedHands.size === 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <p className="text-yellow-800 dark:text-yellow-200">
                  No tracked hands yet. Click the "Track" button on any hand to add it to your tracked list.
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
                  if (typeof filterMode === "number") {
                    const matchScore = hasSelectedTiles ? calculateHandMatch(selectedTiles, hand.pattern) : 0;
                    const matchPercentage = Math.round(matchScore * 100);
                    return matchPercentage >= filterMode;
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
                      const matchScore = hasSelectedTiles ? calculateHandMatch(selectedTiles, hand.pattern) : 0;
                      const isTracked = trackedHands.has(handId);

                      // Determine background color based on match score
                      let bgColorClass = "bg-white dark:bg-gray-700";
                      let borderColorClass = "";
                      if (hasSelectedTiles && matchScore > 0) {
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
                          className={`rounded-md p-3 sm:p-4 flex flex-col gap-2 ${bgColorClass} ${borderColorClass}`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                            <div className="flex-1 overflow-x-auto">
                              <code className="text-sm sm:text-base lg:text-lg font-mono text-gray-900 dark:text-white whitespace-nowrap">
                                {hasSelectedTiles ? renderPatternWithHighlights(hand.pattern) : hand.pattern}
                              </code>
                            </div>
                            <div className="flex gap-2 sm:gap-3 items-center flex-shrink-0">
                              <div className="flex gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Value: <strong className="text-gray-900 dark:text-white">{hand.value}</strong>
                                </span>
                                <span className="text-gray-600 dark:text-gray-400 capitalize">
                                  {hand.exposure}
                                </span>
                                {hand.suitType && (
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      hand.suitType === "single"
                                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                                        : hand.suitType === "multi"
                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                    }`}
                                    title={
                                      hand.suitType === "single"
                                        ? "All number tiles must be from one suit"
                                        : hand.suitType === "multi"
                                        ? "Requires tiles from multiple suits"
                                        : "Can be completed with any suit configuration"
                                    }
                                  >
                                    {hand.suitType === "single" && "1 Suit"}
                                    {hand.suitType === "multi" && "Multi-Suit"}
                                    {hand.suitType === "any" && "Any Suit"}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => toggleTracked(handId)}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  isTracked
                                    ? "bg-blue-600 text-white dark:bg-blue-500"
                                    : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                                }`}
                                title={isTracked ? "Untrack hand" : "Track hand"}
                              >
                                {isTracked ? "✓ Tracking" : "Track"}
                              </button>
                            </div>
                          </div>
                          {hand.notes && (
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic">
                              {hand.notes}
                            </p>
                          )}
                          {hasSelectedTiles && matchScore > 0 && (
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

            {/* Note about data */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Data Source:</strong> Hand patterns sourced from{" "}
                <a
                  href="https://ilovemahj.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline font-semibold"
                >
                  I Love Mahj
                </a>{" "}
                card analysis. The National Mah Jongg League updates the
                official card every April. For official gameplay, please
                purchase the current year's card from{" "}
                <a
                  href="https://www.nationalmahjonggleague.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  nationalmahjonggleague.org
                </a>
                .
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
      {hasSelectedTiles && (
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
                        onClick={() => {
                          setSelectedTiles(prev => {
                            const { [tile as TileType]: _, ...rest } = prev;
                            return rest as Record<TileType, number>;
                          });
                        }}
                        style={{ animationDelay: `${index * 30}ms` }}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium cursor-pointer transition-all active:scale-95 hover:scale-105 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 ${colorClass}`}
                        title={`Click to remove ${TILE_DESCRIPTIONS[tile as TileType]}`}
                      >
                        <span className="font-mono text-xs">{TILE_DESCRIPTIONS[tile as TileType]}</span>
                        <span className="font-bold text-xs">×{count}</span>
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
