import OBR from "@owlbear-rodeo/sdk";
import { useEffect } from "react";
import throttle from "lodash.throttle";

import { useDiceControlsStore } from "../controls/store";

const THROTTLE_TIME = 100;
const SIDEBAR_WIDTH = 60;
const PANEL_WIDTH = 200;

/**
 * Keep the popover width sized to fit the sidebar + tray (calc(100vh / 2))
 * plus the breakdown panel when expanded.
 */
export function ResizeObserver() {
  const expanded = useDiceControlsStore((state) => state.diceResultsExpanded);

  useEffect(() => {
    const handleResize = throttle(() => {
      const panelWidth = expanded ? PANEL_WIDTH : 0;
      OBR.action.setWidth(
        window.innerHeight / 2 + SIDEBAR_WIDTH + panelWidth
      );
    }, THROTTLE_TIME);

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [expanded]);

  return null;
}
