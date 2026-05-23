import SimpleBar from "simplebar-react";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import { DicePicker } from "./DicePicker";
import { DifficultyControl } from "./DifficultyControl";
import { DiceHidden } from "./DiceHidden";
import { DiceBreakdownToggle } from "./DiceBreakdownToggle";
import { DiceHistory } from "./DiceHistory";

import { FairnessTesterButton } from "../tests/FairnessTesterButton";

import { PluginGate } from "../plugin/PluginGate";
import { DiceRollSync } from "../plugin/DiceRollSync";
import { PartyTrays } from "../plugin/PartyTrays";
import { ResizeObserver as PluginResizeObserver } from "../plugin/ResizeObserver";

export function Sidebar() {
  return (
    <SimpleBar
      style={{
        maxHeight: "100vh",
        width: "60px",
        minWidth: "60px",
        overflowY: "auto",
      }}
    >
      <Stack p={1} gap={1} alignItems="center">
        <DicePicker />
        <Divider flexItem sx={{ mx: 1 }} />
        <DifficultyControl />
        <DiceHidden />
        <DiceBreakdownToggle />
        <DiceHistory />
        <FairnessTesterButton />
        <PluginGate>
          <Divider flexItem sx={{ mx: 1 }} />
          <DiceRollSync />
          <PartyTrays />
          <PluginResizeObserver />
        </PluginGate>
      </Stack>
    </SimpleBar>
  );
}
