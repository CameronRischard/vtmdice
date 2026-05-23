import { Dice, isDice } from "../types/Dice";
import { Die, isDie } from "../types/Die";
import { DiceRoll } from "../types/DiceRoll";
import { VTM_HUNGER_STYLE } from "../sets/diceSets";

export type VtmFaceKind =
  | "BESTIAL"
  | "FAILURE"
  | "SUCCESS"
  | "CRIT"
  | "MESSY_CRIT";

export interface VtmDieResult {
  id: string;
  face: number;
  hunger: boolean;
  kind: VtmFaceKind;
}

export type VtmVerdict =
  | "CRITICAL_WIN"
  | "MESSY_CRITICAL"
  | "WIN"
  | "FAILURE"
  | "TOTAL_FAILURE"
  | "BESTIAL_FAILURE";

export interface VtmResult {
  dice: VtmDieResult[];
  successes: number;
  baseSuccesses: number;
  critPairs: number;
  hasCrit: boolean;
  isMessy: boolean;
  hungerOnes: number;
  verdict: VtmVerdict | null;
}

function collectDice(roll: DiceRoll | Dice): Die[] {
  const out: Die[] = [];
  for (const entry of roll.dice) {
    if (isDie(entry)) {
      out.push(entry);
    } else if (isDice(entry)) {
      out.push(...collectDice(entry));
    }
  }
  return out;
}

function faceFromValue(raw: number): number {
  return raw === 0 ? 10 : raw;
}

export function getVtmResult(
  roll: DiceRoll,
  rollValues: Record<string, number>,
  difficulty: number | null
): VtmResult {
  const dice = collectDice(roll);

  let regularTens = 0;
  let hungerTens = 0;
  let baseSuccesses = 0;
  let hungerOnes = 0;

  const settled: { id: string; face: number; hunger: boolean }[] = [];
  for (const die of dice) {
    const raw = rollValues[die.id];
    if (raw === undefined) continue;
    const face = faceFromValue(raw);
    const hunger = die.style === VTM_HUNGER_STYLE;
    settled.push({ id: die.id, face, hunger });
    if (face >= 6) baseSuccesses += 1;
    if (face === 10) {
      if (hunger) hungerTens += 1;
      else regularTens += 1;
    }
    if (hunger && face === 1) hungerOnes += 1;
  }

  const totalTens = regularTens + hungerTens;
  const critPairs = Math.floor(totalTens / 2);
  const hasCrit = critPairs >= 1;
  const regularOnlyPairs = Math.floor(regularTens / 2);
  const isMessy = hasCrit && critPairs > regularOnlyPairs;

  const successes = baseSuccesses + critPairs * 2;

  const hungerTenIds = new Set<string>();
  const regularTenIds: string[] = [];
  for (const d of settled) {
    if (d.face === 10) {
      if (d.hunger) hungerTenIds.add(d.id);
      else regularTenIds.push(d.id);
    }
  }
  // Determine which tens participate in a crit pair, preferring regular+regular
  // pairs first so a hunger 10 only "becomes" a messy crit when it has to.
  const inCritPair = new Set<string>();
  let regularsPaired = regularOnlyPairs * 2;
  for (let i = 0; i < regularsPaired; i++) {
    inCritPair.add(regularTenIds[i]);
  }
  let remainingPairs = critPairs - regularOnlyPairs;
  const leftoverRegular = regularTenIds.slice(regularsPaired);
  const hungerList = Array.from(hungerTenIds);
  let regIdx = 0;
  let hunIdx = 0;
  while (remainingPairs > 0) {
    // Mixed pair (leftover regular + hunger)
    if (regIdx < leftoverRegular.length && hunIdx < hungerList.length) {
      inCritPair.add(leftoverRegular[regIdx++]);
      inCritPair.add(hungerList[hunIdx++]);
    } else if (hunIdx + 1 < hungerList.length) {
      inCritPair.add(hungerList[hunIdx++]);
      inCritPair.add(hungerList[hunIdx++]);
    } else {
      break;
    }
    remainingPairs -= 1;
  }

  const resultDice: VtmDieResult[] = settled.map((d) => {
    let kind: VtmFaceKind;
    if (d.hunger && d.face === 1) {
      kind = "BESTIAL";
    } else if (d.face === 10 && inCritPair.has(d.id)) {
      kind = d.hunger ? "MESSY_CRIT" : "CRIT";
    } else if (d.face >= 6) {
      kind = "SUCCESS";
    } else {
      kind = "FAILURE";
    }
    return { ...d, kind };
  });

  let verdict: VtmVerdict | null = null;
  if (difficulty !== null && dice.length > 0) {
    if (successes >= difficulty) {
      if (hasCrit) {
        verdict = isMessy ? "MESSY_CRITICAL" : "CRITICAL_WIN";
      } else {
        verdict = "WIN";
      }
    } else {
      if (hungerOnes > 0) {
        verdict = successes === 0 ? "BESTIAL_FAILURE" : "BESTIAL_FAILURE";
      } else {
        verdict = successes === 0 ? "TOTAL_FAILURE" : "FAILURE";
      }
    }
  }

  return {
    dice: resultDice,
    successes,
    baseSuccesses,
    critPairs,
    hasCrit,
    isMessy,
    hungerOnes,
    verdict,
  };
}
