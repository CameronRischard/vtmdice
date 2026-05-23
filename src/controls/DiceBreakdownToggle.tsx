import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import OpenIcon from "@mui/icons-material/FormatListBulletedRounded";
import ClosedIcon from "@mui/icons-material/SubjectRounded";

import { useDiceControlsStore } from "./store";

export function DiceBreakdownToggle() {
  const expanded = useDiceControlsStore((state) => state.diceResultsExpanded);
  const toggle = useDiceControlsStore(
    (state) => state.toggleDiceResultsExpanded
  );

  return (
    <Tooltip
      title={expanded ? "Hide Breakdown" : "Show Breakdown"}
      placement="top"
      disableInteractive
    >
      <IconButton onClick={toggle}>
        {expanded ? <OpenIcon /> : <ClosedIcon />}
      </IconButton>
    </Tooltip>
  );
}
