import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useMemo } from "react";
import throttle from "lodash.throttle";

import { useDiceControlsStore } from "../controls/store";
import { useDiceRollStore } from "../dice/store";

const THROTTLE_TIME = 100;
const SIDEBAR_WIDTH = 60;
const PANEL_WIDTH = 115;

/**
 * Keep the popover width sized to fit the sidebar + tray (calc(100vh / 2))
 * plus the breakdown panel when it is actually rendered.
 */
export function ResizeObserver() {
  const expanded = useDiceControlsStore((state) => state.diceResultsExpanded);
  const roll = useDiceRollStore((state) => state.roll);
  const rollValues = useDiceRollStore((state) => state.rollValues);

  const panelVisible = useMemo(() => {
    if (!roll || roll.hidden || !expanded) return false;
    const values = Object.values(rollValues);
    if (values.length === 0) return false;
    return values.every((v) => v !== null);
  }, [roll, rollValues, expanded]);

  useEffect(() => {
    const handleResize = throttle(() => {
      const panelWidth = panelVisible ? PANEL_WIDTH : 0;
      OBR.action.setWidth(
        window.innerHeight / 2 + SIDEBAR_WIDTH + panelWidth
      );
    }, THROTTLE_TIME);

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [panelVisible]);

  return null;
}
