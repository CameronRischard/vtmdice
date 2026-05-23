import { useMemo } from "react";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grow from "@mui/material/Grow";
import Tooltip from "@mui/material/Tooltip";
import { keyframes, styled } from "@mui/material/styles";

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const Pill = styled("span")<{ $color: string }>(({ $color }) => ({
  fontSize: 11,
  lineHeight: 1.4,
  fontWeight: 600,
  color: $color,
  backgroundColor: hexToRgba($color, 0.15),
  border: `1px solid ${hexToRgba($color, 0.45)}`,
  borderRadius: 999,
  padding: "1px 8px",
  whiteSpace: "nowrap",
}));

function BreakdownPill({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return <Pill $color={color}>{children}</Pill>;
}

const ChipGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(2, 30px)",
  gap: 10,
  justifyContent: "flex-start",
});

const ChipBox = styled("div")<{
  $bg: string;
  $color: string;
  $border: string;
  $boxShadow?: string;
  $animation?: string;
  $opacity?: number;
}>(({ $bg, $color, $border, $boxShadow, $animation, $opacity }) => ({
  width: 30,
  height: 30,
  borderRadius: "50%",
  backgroundColor: $bg,
  border: $border,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 15,
  color: $color,
  boxShadow: $boxShadow,
  animation: $animation,
  opacity: $opacity,
}));

import { DiceRoll } from "../types/DiceRoll";
import { getVtmResult, VtmDieResult, VtmVerdict } from "../helpers/getVtmResult";
import { useDiceControlsStore } from "./store";

const messyPulse = keyframes`
  0%   { box-shadow: 0 0 4px 1px rgba(255, 60, 60, 0.6), 0 0 0px 0 rgba(255, 200, 80, 0.0); }
  50%  { box-shadow: 0 0 8px 2px rgba(255, 60, 60, 0.9), 0 0 10px 2px rgba(255, 200, 80, 0.6); }
  100% { box-shadow: 0 0 4px 1px rgba(255, 60, 60, 0.6), 0 0 0px 0 rgba(255, 200, 80, 0.0); }
`;

const bestialPulse = keyframes`
  0%   { box-shadow: 0 0 4px 1px rgba(255, 48, 48, 0.6); }
  50%  { box-shadow: 0 0 9px 3px rgba(255, 48, 48, 1.0); }
  100% { box-shadow: 0 0 4px 1px rgba(255, 48, 48, 0.6); }
`;

function verdictText(verdict: VtmVerdict): string {
  switch (verdict) {
    case "CRITICAL_WIN":
      return "Critical Win";
    case "MESSY_CRITICAL":
      return "Messy Critical";
    case "WIN":
      return "Success";
    case "FAILURE":
      return "Failure";
    case "TOTAL_FAILURE":
      return "Total Failure";
    case "BESTIAL_FAILURE":
      return "Bestial Failure";
  }
}

function verdictColor(verdict: VtmVerdict): string {
  switch (verdict) {
    case "CRITICAL_WIN":
      return "#ffd95a";
    case "MESSY_CRITICAL":
      return "#ff5a5a";
    case "WIN":
      return "#7ed957";
    case "FAILURE":
      return "#bbbbbb";
    case "TOTAL_FAILURE":
      return "#888888";
    case "BESTIAL_FAILURE":
      return "#ff5a5a";
  }
}

function DieChip({ die }: { die: VtmDieResult }) {
  const baseBg = die.hunger ? "#3a0a0a" : "#0c0c10";
  const textColor = die.hunger ? "#ff5b5b" : "#f2f2f2";

  let border = "1px solid rgba(255,255,255,0.18)";
  let boxShadow: string | undefined;
  let animation: string | undefined;
  let opacity: number | undefined;

  switch (die.kind) {
    case "SUCCESS":
      border = "2px solid #7ed957";
      break;
    case "CRIT":
      border = "2px solid #ffffff";
      boxShadow =
        "0 0 4px 1px rgba(255,255,255,0.95), 0 0 8px 3px rgba(255,255,255,0.45), 0 0 12px 4px rgba(255,217,120,0.3)";
      break;
    case "MESSY_CRIT":
      border = "2px solid #ffd95a";
      animation = `${messyPulse} 1.4s ease-in-out infinite`;
      break;
    case "BESTIAL":
      border = "2px solid #ff3030";
      animation = `${bestialPulse} 1.4s ease-in-out infinite`;
      break;
    case "FAILURE":
      border = "1px solid rgba(255,255,255,0.18)";
      opacity = 0.65;
      break;
  }

  return (
    <Tooltip
      title={`${die.hunger ? "Hunger" : "Regular"} d10 — ${labelForKind(
        die.kind
      )}`}
      disableInteractive
    >
      <ChipBox
        $bg={baseBg}
        $color={textColor}
        $border={border}
        $boxShadow={boxShadow}
        $animation={animation}
        $opacity={opacity}
      >
        {die.face}
      </ChipBox>
    </Tooltip>
  );
}

function labelForKind(kind: VtmDieResult["kind"]): string {
  switch (kind) {
    case "BESTIAL":
      return "Bestial Failure";
    case "MESSY_CRIT":
      return "Messy Critical 10";
    case "CRIT":
      return "Critical 10";
    case "SUCCESS":
      return "Success";
    case "FAILURE":
      return "Failure";
  }
}

export function DiceResults({
  diceRoll,
  rollValues,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
}) {
  const difficulty = useDiceControlsStore((state) => state.diceDifficulty);

  const result = useMemo(
    () => getVtmResult(diceRoll, rollValues, difficulty),
    [diceRoll, rollValues, difficulty]
  );

  const summaryColor = result.verdict
    ? verdictColor(result.verdict)
    : result.isMessy
    ? "#ffd95a"
    : "white";

  return (
    <Stack alignItems="center" maxHeight="calc(100vh - 100px)" gap={0.5}>
      <Stack alignItems="center" sx={{ padding: 0.5 }}>
        <Typography variant="h4" sx={{ color: summaryColor, lineHeight: 1 }}>
          {result.successes}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "white", opacity: 0.7, lineHeight: 1 }}
        >
          {result.successes === 1 ? "success" : "successes"}
          {difficulty !== null && ` / ${difficulty}`}
        </Typography>
      </Stack>
      {result.verdict && (
        <Typography
          variant="subtitle2"
          sx={{
            color: verdictColor(result.verdict),
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          {verdictText(result.verdict)}
        </Typography>
      )}
      {!result.verdict && result.isMessy && (
        <Typography
          variant="subtitle2"
          sx={{
            color: "#ffd95a",
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          Critical {result.dice.some((d) => d.kind === "MESSY_CRIT") && "(Messy)"}
        </Typography>
      )}
    </Stack>
  );
}

export function DiceResultsBreakdown({
  diceRoll,
  rollValues,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
}) {
  const difficulty = useDiceControlsStore((state) => state.diceDifficulty);
  const expanded = useDiceControlsStore(
    (state) => state.diceResultsExpanded
  );

  const result = useMemo(
    () => getVtmResult(diceRoll, rollValues, difficulty),
    [diceRoll, rollValues, difficulty]
  );

  return (
    <Grow
      in={expanded}
      mountOnEnter
      unmountOnExit
      style={{ transformOrigin: "0% 0% 0" }}
    >
      <Stack
        overflow="visible"
        sx={{
          px: 0.5,
          py: 0.5,
          gap: 1,
          alignItems: "flex-start",
        }}
      >
        <ChipGrid>
          {result.dice.map((d) => (
            <DieChip key={d.id} die={d} />
          ))}
        </ChipGrid>
        <Stack direction="column" gap={0.75} alignItems="flex-start">
          <BreakdownPill color="#7ed957">
            {result.baseSuccesses}{" "}
            {result.baseSuccesses === 1 ? "success" : "successes"}
          </BreakdownPill>
          {result.hasCrit && (
            <BreakdownPill color="#ffd95a">
              +{result.critPairs * 2} crit ({result.critPairs} pair
              {result.critPairs === 1 ? "" : "s"})
            </BreakdownPill>
          )}
          {result.hungerOnes > 0 && (
            <BreakdownPill color="#ff5a5a">
              {result.hungerOnes} bestial
            </BreakdownPill>
          )}
        </Stack>
      </Stack>
    </Grow>
  );
}
