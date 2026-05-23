import { useMemo } from "react";
import Box from "@mui/material/Box";

import { useDiceRollStore } from "../dice/store";
import { useDiceControlsStore } from "./store";
import { DiceResultsBreakdown } from "./DiceResults";

export function DiceResultsPanel() {
  const roll = useDiceRollStore((state) => state.roll);
  const rollValues = useDiceRollStore((state) => state.rollValues);
  const expanded = useDiceControlsStore((state) => state.diceResultsExpanded);

  const finishedRollValues = useMemo(() => {
    const values: Record<string, number> = {};
    for (const [id, value] of Object.entries(rollValues)) {
      if (value !== null) {
        values[id] = value;
      }
    }
    return values;
  }, [rollValues]);

  const finishedRolling = useMemo(() => {
    const values = Object.values(rollValues);
    if (values.length === 0) return false;
    return values.every((v) => v !== null);
  }, [rollValues]);

  if (!roll || !finishedRolling || roll.hidden || !expanded) {
    return null;
  }

  return (
    <Box
      sx={{
        alignSelf: "flex-start",
        width: "fit-content",
        py: 2,
      }}
      component="div"
    >
      <DiceResultsBreakdown diceRoll={roll} rollValues={finishedRollValues} />
    </Box>
  );
}
